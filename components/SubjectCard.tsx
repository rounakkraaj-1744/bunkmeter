import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Subject } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { CircularProgress } from './CircularProgress';
import { SquarePen, Pencil, Trash2, Calendar, Clock } from 'lucide-react-native';

interface SubjectCardProps {
  subject: Subject;
  attendance: {
    totalClasses: number;
    presentClasses: number;
    percentage: number;
  };
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, attendance, onPress, onEdit, onDelete }) => {
  const { theme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    setShowMenu(false);
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subject.name}"? This will also delete all attendance records for this subject.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const handleEdit = () => {
    setShowMenu(false);
    onEdit();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={[styles.colorDot, { backgroundColor: subject.color }]} />
            <View style={styles.titleContent}>
              <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
                {subject.name}
              </Text>
              {subject.description ? (
                <View style={styles.descriptionContainer}>
                  <Clock size={12} color={theme.colors.onSurface + '60'} />
                  <Text style={[styles.description, { color: theme.colors.onSurface + '60' }]} numberOfLines={1}>
                    {subject.description}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
          >
            <SquarePen size={20} color={theme.colors.onSurface + '80'} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.progressContainer}>
            <CircularProgress percentage={attendance.percentage} size={60} strokeWidth={6} color={attendance.percentage < 75 ? theme.colors.error : theme.colors.success}
              textColor={theme.colors.onSurface}/>
          </View>

          <View style={styles.statsContainer}>
            <Text style={[styles.classCount, { color: theme.colors.onSurface }]}>
              {attendance.presentClasses} / {attendance.totalClasses} classes
            </Text>
            <View style={styles.scheduleContainer}>
              <Calendar size={12} color={theme.colors.onSurface + '60'} />
              <Text style={[styles.schedule, { color: theme.colors.onSurface + '60' }]}>
                {subject.weeklySchedule.length} day{subject.weeklySchedule.length !== 1 ? 's' : ''} per week
              </Text>
            </View>
            {attendance.percentage < 75 && (
              <View style={[styles.warningBadge, { backgroundColor: theme.colors.error + '20' }]}>
                <Text style={[styles.warningText, { color: theme.colors.error }]}>
                  ⚠️ Low Attendance
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={[styles.menuContainer, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Pencil size={18} color={theme.colors.onSurface} />
              <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>Edit Subject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Trash2 size={18} color={theme.colors.error} />
              <Text style={[styles.menuText, { color: theme.colors.error }]}>Delete Subject</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  titleContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    marginRight: 16,
  },
  statsContainer: {
    flex: 1,
  },
  classCount: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  schedule: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  warningBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  warningText: {
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 8,
    minWidth: 160,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 12,
  },
});