import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface Subject {
  id: string;
  name: string;
  description: string;
  color: string;
  weeklySchedule: string[];
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent' | 'cancelled';
  classCount: number;
  notes?: string;
  assignment?: string;
  assignmentDueDate?: string; 
}

interface AttendanceState {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  isLoading: boolean;
}

type AttendanceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'ADD_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'UPDATE_ATTENDANCE'; payload: AttendanceRecord }
  | { type: 'DELETE_ATTENDANCE'; payload: string }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'SET_ATTENDANCE'; payload: AttendanceRecord[] };

const initialState: AttendanceState = {
  subjects: [],
  attendance: [],
  isLoading: false,
};

const attendanceReducer = (state: AttendanceState, action: AttendanceAction): AttendanceState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [...state.subjects, action.payload],
      };
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject.id === action.payload.id ? action.payload : subject
        ),
      };
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        attendance: state.attendance.filter(record => record.subjectId !== action.payload),
      };
    case 'ADD_ATTENDANCE':
      return {
        ...state,
        attendance: [...state.attendance, action.payload],
      };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map(record =>
          record.id === action.payload.id ? action.payload : record
        ),
      };
    case 'DELETE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.filter(record => record.id !== action.payload),
      };
    case 'SET_SUBJECTS':
      return {
        ...state,
        subjects: action.payload,
      };
    case 'SET_ATTENDANCE':
      return {
        ...state,
        attendance: action.payload,
      };
    default:
      return state;
  }
};

const storeData = async (key: string, data: any) => {
  try {
    const jsonData = JSON.stringify(data);
    if (Platform.OS === 'web') {
      localStorage.setItem(key, jsonData);
    } else {
      await SecureStore.setItemAsync(key, jsonData);
    }
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const getData = async (key: string) => {
  try {
    let data: string | null;
    if (Platform.OS === 'web') {
      data = localStorage.getItem(key);
    } else {
      data = await SecureStore.getItemAsync(key);
    }
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
};

interface AttendanceContextType {
  state: AttendanceState;
  dispatch: React.Dispatch<AttendanceAction>;
  fetchSubjects: () => Promise<void>;
  createSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  fetchAttendance: (subjectId: string) => Promise<void>;
  saveAttendance: (attendance: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  getSubjectAttendance: (subjectId: string) => {
    totalClasses: number;
    presentClasses: number;
    percentage: number;
  };
  getAttendanceForDate: (subjectId: string, date: string) => AttendanceRecord | null;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  // Load data on app start
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const subjects = await getData('subjects');
      const attendance = await getData('attendance');
      
      if (subjects) {
        const formattedSubjects = subjects.map((subject: any) => ({
          ...subject,
          createdAt: new Date(subject.createdAt),
        }));
        dispatch({ type: 'SET_SUBJECTS', payload: formattedSubjects });
      }
      
      if (attendance) {
        dispatch({ type: 'SET_ATTENDANCE', payload: attendance });
      }
    }
    catch (error) {
      console.error('Error loading initial data:', error);
    }
    finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchSubjects = async () => {
    return Promise.resolve();
  };

  const createSubject = async (subject: Omit<Subject, 'id' | 'createdAt'>) => {
    try {
      const newSubject: Subject = {
        ...subject,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      
      const updatedSubjects = [...state.subjects, newSubject];
      await storeData('subjects', updatedSubjects);
      dispatch({ type: 'ADD_SUBJECT', payload: newSubject });
    }
    catch (error) {
      console.error('Create subject error:', error);
      throw error;
    }
  };

  const updateSubject = async (id: string, subjectUpdate: Partial<Subject>) => {
    try {
      const existingSubject = state.subjects.find(s => s.id === id);
      if (!existingSubject) {
        throw new Error('Subject not found');
      }
      
      const updatedSubject = { ...existingSubject, ...subjectUpdate };
      const updatedSubjects = state.subjects.map(s => s.id === id ? updatedSubject : s);
      
      await storeData('subjects', updatedSubjects);
      dispatch({ type: 'UPDATE_SUBJECT', payload: updatedSubject });
    } catch (error) {
      console.error('Update subject error:', error);
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const updatedSubjects = state.subjects.filter(s => s.id !== id);
      const updatedAttendance = state.attendance.filter(a => a.subjectId !== id);
      
      await storeData('subjects', updatedSubjects);
      await storeData('attendance', updatedAttendance);
      dispatch({ type: 'DELETE_SUBJECT', payload: id });
    } catch (error) {
      console.error('Delete subject error:', error);
      throw error;
    }
  };

  const fetchAttendance = async (subjectId: string) => {
    return Promise.resolve();
  };

  const saveAttendance = async (attendanceData: Omit<AttendanceRecord, 'id'>) => {
    try {
      const existingRecord = state.attendance.find(
        record => record.subjectId === attendanceData.subjectId && record.date === attendanceData.date
      );
      
      if (existingRecord) {
        const updatedRecord = { ...existingRecord, ...attendanceData };
        const updatedAttendance = state.attendance.map(record =>
          record.id === existingRecord.id ? updatedRecord : record
        );
        
        await storeData('attendance', updatedAttendance);
        dispatch({ type: 'UPDATE_ATTENDANCE', payload: updatedRecord });
      } else {
        const newRecord: AttendanceRecord = {
          ...attendanceData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        
        const updatedAttendance = [...state.attendance, newRecord];
        await storeData('attendance', updatedAttendance);
        dispatch({ type: 'ADD_ATTENDANCE', payload: newRecord });
      }
    }
    catch (error) {
      console.error('Save attendance error:', error);
      throw error;
    }
  };

  const getSubjectAttendance = (subjectId: string) => {
    const subjectAttendance = state.attendance.filter(record => record.subjectId === subjectId);
    const totalClasses = subjectAttendance.reduce((sum, record) => sum + record.classCount, 0);
    const presentClasses = subjectAttendance
      .filter(record => record.status === 'present')
      .reduce((sum, record) => sum + record.classCount, 0);
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return { totalClasses, presentClasses, percentage };
  };

  const getAttendanceForDate = (subjectId: string, date: string) => {
    return state.attendance.find(record => record.subjectId === subjectId && record.date === date) || null;
  };

  return (
    <AttendanceContext.Provider value={{ 
      state, 
      dispatch, 
      fetchSubjects,
      createSubject,
      updateSubject,
      deleteSubject,
      fetchAttendance,
      saveAttendance,
      getSubjectAttendance, 
      getAttendanceForDate 
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};