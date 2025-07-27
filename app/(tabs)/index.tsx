import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { SubjectCard } from '@/components/SubjectCard';
import { Plus, RefreshCw, TriangleAlert as AlertTriangle, Calendar } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function HomeScreen() {
  const { state, getSubjectAttendance, fetchSubjects, deleteSubject } = useAttendance();
  const { theme } = useTheme();
  const { getUpcomingDeadlines, getLowAttendanceSubjects } = useNotifications();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectPress = (subjectId: string) => {
    router.push(`/subject/${subjectId}`);
  };

  const handleAddSubject = () => {
    router.push('/add-subject');
  };

  const handleEditSubject = (subjectId: string) => {
    router.push(`/edit-subject/${subjectId}`);
  };

  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteSubject(subjectId);
    } catch (error: any) {
      console.error('Delete subject error:', error);
    }
  };

  const handleRefresh = () => {
    fetchSubjects();
  };

  const upcomingDeadlines = getUpcomingDeadlines(3);
  const lowAttendanceSubjects = getLowAttendanceSubjects();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, {
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>My Subjects</Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurface + '80' }]}>Track your attendance easily</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {(upcomingDeadlines.length > 0 || lowAttendanceSubjects.length > 0) && (
          <View style={styles.alertsSection}>
            {upcomingDeadlines.length > 0 && (
              <View style={[styles.alertCard, {
                backgroundColor: theme.colors.surface,
                borderLeftColor: theme.colors.warning
              }]}>
                <Calendar size={20} color={theme.colors.warning} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: theme.colors.warning }]}>
                    Upcoming Deadlines
                  </Text>
                  {upcomingDeadlines.slice(0, 2).map(assignment => {
                    const subject = state.subjects.find(s => s.id === assignment.subjectId);
                    const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <Text key={assignment.id} style={[styles.alertText, { color: theme.colors.onSurface + '80' }]}>
                        • {assignment.title} ({subject?.name}) - {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                      </Text>
                    );
                  })}
                </View>
              </View>
            )}

            {
              lowAttendanceSubjects.length > 0 && (
                <View style={[styles.alertCard, {
                  backgroundColor: theme.colors.surface,
                  borderLeftColor: theme.colors.error
                }]}>
                  <AlertTriangle size={20} color={theme.colors.error} />
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, { color: theme.colors.error }]}>
                      Low Attendance Alert
                    </Text>
                    <Text style={[styles.alertText, { color: theme.colors.onSurface + '80' }]}>
                      {lowAttendanceSubjects.length} subject{lowAttendanceSubjects.length > 1 ? 's' : ''} below 75%
                    </Text>
                  </View>
                </View>
              )}
          </View>
        )
        }

        {state.subjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>No subjects added yet</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurface + '80' }]}>
              Add your first subject to start tracking attendance
            </Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddSubject}>
              <Plus size={20} color={theme.colors.onPrimary} />
              <Text style={[styles.addButtonText, { color: theme.colors.onPrimary }]}>Add Subject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          state.subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              attendance={getSubjectAttendance(subject.id)}
              onPress={() => handleSubjectPress(subject.id)}
              onEdit={() => handleEditSubject(subject.id)}
              onDelete={() => handleDeleteSubject(subject.id)}
            />
          ))
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
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
    marginBottom: 32,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  alertsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
  },
});