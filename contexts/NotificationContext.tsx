import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAttendance } from './AttendanceContext';

interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
}

interface NotificationState {
  assignments: Assignment[];
  lowAttendanceAlerts: string[];
  upcomingDeadlines: Assignment[];
}

type NotificationAction =
  | { type: 'SET_ASSIGNMENTS'; payload: Assignment[] }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'SET_LOW_ATTENDANCE_ALERTS'; payload: string[] }
  | { type: 'SET_UPCOMING_DEADLINES'; payload: Assignment[] };

const initialState: NotificationState = {
  assignments: [],
  lowAttendanceAlerts: [],
  upcomingDeadlines: [],
};

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_ASSIGNMENTS':
      return { ...state, assignments: action.payload };
    case 'ADD_ASSIGNMENT':
      return { ...state, assignments: [...state.assignments, action.payload] };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.id ? action.payload : assignment
        ),
      };
    case 'SET_LOW_ATTENDANCE_ALERTS':
      return { ...state, lowAttendanceAlerts: action.payload };
    case 'SET_UPCOMING_DEADLINES':
      return { ...state, upcomingDeadlines: action.payload };
    default:
      return state;
  }
};

interface NotificationContextType {
  state: NotificationState;
  checkForAlerts: () => void;
  getUpcomingDeadlines: (days?: number) => Assignment[];
  getLowAttendanceSubjects: () => string[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { state: attendanceState, getSubjectAttendance } = useAttendance();

  useEffect(() => {
    checkForAlerts();
  }, [attendanceState.subjects, attendanceState.attendance]);

  const checkForAlerts = () => {
    // Check for low attendance
    const lowAttendanceSubjects = attendanceState.subjects
      .filter(subject => {
        const attendance = getSubjectAttendance(subject.id);
        return attendance.percentage < 75 && attendance.totalClasses > 0;
      })
      .map(subject => subject.id);

    dispatch({ type: 'SET_LOW_ATTENDANCE_ALERTS', payload: lowAttendanceSubjects });

    // Extract assignments from attendance records
    const assignments: Assignment[] = [];
    attendanceState.attendance.forEach(record => {
      if (record.assignment && record.assignment.trim() && record.assignmentDueDate) {
        assignments.push({
          id: `${record.id}-assignment`,
          subjectId: record.subjectId,
          title: record.assignment,
          dueDate: record.assignmentDueDate,
          isCompleted: false,
        });
      }
    });

    dispatch({ type: 'SET_ASSIGNMENTS', payload: assignments });

    // Check for upcoming deadlines
    const upcomingDeadlines = getUpcomingDeadlines(7);
    dispatch({ type: 'SET_UPCOMING_DEADLINES', payload: upcomingDeadlines });
  };

  const getUpcomingDeadlines = (days: number = 7): Assignment[] => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return state.assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= today && dueDate <= futureDate && !assignment.isCompleted;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getLowAttendanceSubjects = (): string[] => {
    return state.lowAttendanceAlerts;
  };

  return (
    <NotificationContext.Provider value={{
      state,
      checkForAlerts,
      getUpcomingDeadlines,
      getLowAttendanceSubjects,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};