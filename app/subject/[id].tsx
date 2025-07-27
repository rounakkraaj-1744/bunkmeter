import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { AttendanceBottomSheet } from '@/components/AttendanceBottomSheet';
import { ArrowLeft } from 'lucide-react-native';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');
const CALENDAR_WIDTH = width - 40;
const DAY_SIZE = CALENDAR_WIDTH / 7;

export default function SubjectCalendarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, getSubjectAttendance, getAttendanceForDate, fetchAttendance, saveAttendance } = useAttendance();
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const subject = state.subjects.find(s => s.id === id);
  const attendance = getSubjectAttendance(id!);

  useEffect(() => {
    if (id) {
      fetchAttendance(id);
    }
  }, [id]);

  if (!subject) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.onBackground }]}>Subject not found</Text>
      </SafeAreaView>
    );
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateStatus = (date: Date) => {
    const dateString = formatDateString(date);
    const record = getAttendanceForDate(id!, dateString);
    return record?.status || null;
  };

  const handleDatePress = (date: Date) => {
    if (date.getMonth() !== currentMonth.getMonth()) return;
    
    const dateString = formatDateString(date);
    setSelectedDate(dateString);
    setShowBottomSheet(true);
  };

  const handleSaveAttendance = async (attendanceData: any) => {
    setIsLoading(true);
    try {
      await saveAttendance({
        subjectId: id!,
        ...attendanceData,
      });
    } catch (error: any) {
      console.error('Save attendance error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <View style={[styles.calendarContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Text style={[styles.navButton, { color: theme.colors.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: theme.colors.onSurface }]}>{monthName}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Text style={[styles.navButton, { color: theme.colors.primary }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <View key={index} style={styles.weekDay}>
              <Text style={[styles.weekDayText, { color: theme.colors.onSurface + '80' }]}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendar}>
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const status = getDateStatus(day);
            const isToday = formatDateString(day) === formatDateString(new Date());

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  !isCurrentMonth && styles.otherMonth,
                  status === 'present' && styles.presentDay,
                  status === 'absent' && styles.absentDay,
                  status === 'cancelled' && styles.cancelledDay,
                  isToday && [styles.today, { borderColor: theme.colors.primary }],
                ]}
                onPress={() => handleDatePress(day)}
                disabled={!isCurrentMonth}
              >
                <Text style={[
                  styles.dayText,
                  { color: theme.colors.onSurface },
                  !isCurrentMonth && [styles.otherMonthText, { color: theme.colors.onSurface + '40' }],
                  status && styles.statusText,
                  isToday && [styles.todayText, { color: theme.colors.primary }],
                ]}>
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline
      }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>{subject.name}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurface + '80' }]}>Mark your attendance</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{attendance.percentage}%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Attendance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{attendance.presentClasses}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{attendance.totalClasses}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Total</Text>
          </View>
        </View>

        {renderCalendar()}

        <View style={[styles.legend, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.legendTitle, { color: theme.colors.onSurface }]}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface + '80' }]}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF5252' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface + '80' }]}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
              <Text style={[styles.legendText, { color: theme.colors.onSurface + '80' }]}>Cancelled</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <AttendanceBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onSave={handleSaveAttendance}
        date={selectedDate || ''}
        existingRecord={selectedDate ? getAttendanceForDate(id!, selectedDate) : null}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 55,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginTop: 4,
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    paddingHorizontal: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    width: DAY_SIZE,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 1,
  },
  otherMonth: {
    opacity: 0.3,
  },
  presentDay: {
    backgroundColor: '#4CAF50',
  },
  absentDay: {
    backgroundColor: '#FF5252',
  },
  cancelledDay: {
    backgroundColor: '#FFC107',
  },
  today: {
    borderWidth: 2,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  otherMonthText: {},
  statusText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  todayText: {
    fontFamily: 'Roboto-Bold',
  },
  legend: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginTop: 50,
  },
});