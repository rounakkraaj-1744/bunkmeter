import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartBar as BarChart3, TrendingDown, RefreshCw } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function StatsScreen() {
  const { state, getSubjectAttendance, fetchSubjects } = useAttendance();
  const { theme } = useTheme();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const overallStats = state.subjects.reduce(
    (acc, subject) => {
      const attendance = getSubjectAttendance(subject.id);
      acc.totalClasses += attendance.totalClasses;
      acc.presentClasses += attendance.presentClasses;
      acc.subjects += 1;
      return acc;
    },
    { totalClasses: 0, presentClasses: 0, subjects: 0 }
  );

  const overallPercentage = overallStats.totalClasses > 0 
    ? Math.round((overallStats.presentClasses / overallStats.totalClasses) * 100)
    : 0;

  const subjectStats = state.subjects.map(subject => ({
    ...subject,
    ...getSubjectAttendance(subject.id),
  })).sort((a, b) => b.percentage - a.percentage);

  const lowAttendanceSubjects = subjectStats.filter(subject => subject.percentage < 75);

  const handleRefresh = () => {
    fetchSubjects();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline
      }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Statistics</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurface + '80' }]}>Your attendance overview</Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Overall Performance</Text>
          <View style={[styles.overallCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{overallPercentage}%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Overall Attendance</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{overallStats.subjects}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Total Subjects</Text>
              </View>
            </View>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{overallStats.presentClasses}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Classes Attended</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.primary }]}>{overallStats.totalClasses}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurface + '80' }]}>Total Classes</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Subject Performance</Text>
          {subjectStats.map((subject) => (
            <View key={subject.id} style={[styles.subjectStatCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectTitleContainer}>
                  <View style={[styles.colorDot, { backgroundColor: subject.color }]} />
                  <Text style={[styles.subjectName, { color: theme.colors.onSurface }]}>{subject.name}</Text>
                </View>
                <Text style={[
                  styles.percentage,
                  { color: subject.percentage < 75 ? theme.colors.error : theme.colors.success }
                ]}>
                  {subject.percentage}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.outline }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${subject.percentage}%`,
                      backgroundColor: subject.percentage < 75 ? theme.colors.error : theme.colors.success
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.classInfo, { color: theme.colors.onSurface + '80' }]}>
                {subject.presentClasses} / {subject.totalClasses} classes
              </Text>
            </View>
          ))}
        </View>

        {lowAttendanceSubjects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>⚠️ Attention Required</Text>
            <View style={[styles.alertCard, { 
              backgroundColor: theme.colors.surface,
              borderLeftColor: theme.colors.error
            }]}>
              <TrendingDown size={24} color={theme.colors.error} />
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, { color: theme.colors.error }]}>Low Attendance Alert</Text>
                <Text style={[styles.alertText, { color: theme.colors.onSurface + '80' }]}>
                  {lowAttendanceSubjects.length} subject{lowAttendanceSubjects.length > 1 ? 's' : ''} 
                  {lowAttendanceSubjects.length > 1 ? ' have' : ' has'} attendance below 75%
                </Text>
                {lowAttendanceSubjects.map(subject => (
                  <Text key={subject.id} style={[styles.alertSubject, { color: theme.colors.onSurface + '80' }]}>
                    • {subject.name} ({subject.percentage}%)
                  </Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {state.subjects.length === 0 && (
          <View style={styles.emptyState}>
            <BarChart3 size={64} color={theme.colors.onSurface + '60'} />
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No data available</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurface + '80' }]}>
              Add subjects and mark attendance to see statistics
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 55,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  refreshButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 12,
  },
  overallCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  subjectStatCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    flex: 1,
  },
  percentage: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  classInfo: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 8,
  },
  alertSubject: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
});