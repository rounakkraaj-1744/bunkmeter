import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { AttendanceRecord } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Check, X, Calendar, CalendarDays } from 'lucide-react-native';

interface AttendanceBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (attendance: any) => void;
  date: string;
  existingRecord?: AttendanceRecord | null;
  isLoading?: boolean;
}

export const AttendanceBottomSheet: React.FC<AttendanceBottomSheetProps> = ({
  visible,
  onClose,
  onSave,
  date,
  existingRecord,
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<'present' | 'absent' | 'cancelled'>(
    existingRecord?.status || 'present'
  );
  const [classCount, setClassCount] = useState(existingRecord?.classCount?.toString() || '1');
  const [notes, setNotes] = useState(existingRecord?.notes || '');
  const [assignment, setAssignment] = useState(existingRecord?.assignment || '');
  const [assignmentDueDate, setAssignmentDueDate] = useState(existingRecord?.assignmentDueDate || '');

  const handleSave = () => {
    onSave({
      date,
      status,
      classCount: parseInt(classCount, 10) || 1,
      notes,
      assignment,
      assignmentDueDate,
    });
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.bottomSheet, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>Mark Attendance</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.onSurface + '80'} />
            </TouchableOpacity>
          </View>

          <View style={[styles.dateContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Calendar size={16} color={theme.colors.onSurface + '80'} />
            <Text style={[styles.dateText, { color: theme.colors.onSurface }]}>{formatDate(date)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Attendance Status</Text>
            <View style={styles.statusContainer}>
              {[
                { value: 'present', label: 'Present', color: '#4CAF50' },
                { value: 'absent', label: 'Absent', color: '#FF5252' },
                { value: 'cancelled', label: 'Cancelled', color: '#FFC107' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.statusButton,
                    { borderColor: theme.colors.outline },
                    status === option.value && { backgroundColor: option.color },
                  ]}
                  onPress={() => setStatus(option.value as any)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: theme.colors.onSurface + '80' },
                      status === option.value && styles.statusTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Number of Classes</Text>
            <View style={styles.classCountContainer}>
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setClassCount((prev) => Math.max(1, parseInt(prev, 10) - 1).toString())}
              >
                <Text style={[styles.countButtonText, { color: theme.colors.onPrimary }]}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.classCountInput, { 
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.outline
                }]}
                value={classCount}
                onChangeText={setClassCount}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => setClassCount((prev) => (parseInt(prev, 10) + 1).toString())}
              >
                <Text style={[styles.countButtonText, { color: theme.colors.onPrimary }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                color: theme.colors.onSurface,
                borderColor: theme.colors.outline
              }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about the class..."
              placeholderTextColor={theme.colors.onSurface + '60'}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Assignment (Optional)</Text>
            <TextInput
              style={[styles.textInput, { 
                color: theme.colors.onSurface,
                borderColor: theme.colors.outline
              }]}
              value={assignment}
              onChangeText={setAssignment}
              placeholder="Any assignment given..."
              placeholderTextColor={theme.colors.onSurface + '60'}
            />
            
            {assignment.trim() && (
              <View style={styles.dueDateContainer}>
                <CalendarDays size={16} color={theme.colors.onSurface + '80'} />
                <TextInput
                  style={[styles.dueDateInput, { 
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.outline
                  }]}
                  value={assignmentDueDate}
                  onChangeText={setAssignmentDueDate}
                  placeholder="Due date (YYYY-MM-DD)"
                  placeholderTextColor={theme.colors.onSurface + '60'}
                />
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, { 
              backgroundColor: isLoading ? theme.colors.onSurface + '40' : theme.colors.primary
            }]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Check size={20} color={theme.colors.onPrimary} />
            <Text style={[styles.saveButtonText, { color: theme.colors.onPrimary }]}>
              {isLoading ? 'Saving...' : 'Save Attendance'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  statusTextSelected: {
    color: '#FFFFFF',
  },
  classCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  countButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButtonText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  classCountInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    minHeight: 40,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dueDateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});