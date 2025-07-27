import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAttendance } from '@/contexts/AttendanceContext';
import { ColorSelector } from '@/components/ColorSelector';
import { WeeklyScheduleSelector } from '@/components/WeeklyScheduleSelector';
import { Check, ArrowLeft, Clock } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function EditSubjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateSubject } = useAttendance();
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#E3F2FD');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const subject = state.subjects.find(s => s.id === id);

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.name);
      setDescription(subject.description || '');
      setSelectedColor(subject.color);
      setSelectedDays(subject.weeklySchedule);
    }
  }, [subject]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!subjectName.trim()) {
      Alert.alert('Error', 'Please enter a subject name');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setIsLoading(true);
    try {
      await updateSubject(id!, {
        name: subjectName.trim(),
        description: description.trim(),
        color: selectedColor,
        weeklySchedule: selectedDays,
      });
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update subject');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Subject not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Subject</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Check size={24} color={isLoading ? "#999" : "#6200EE"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Name</Text>
          <TextInput
            style={styles.textInput}
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder="Enter subject name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionSubtitle}>
            Add timing, teacher name, or any other details
          </Text>
          <View style={styles.descriptionContainer}>
            <Clock size={20} color="#666" style={styles.descriptionIcon} />
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Mon-Wed-Fri 9:00 AM, Prof. Smith"
              placeholderTextColor="#999"
              multiline
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Tag</Text>
          <ColorSelector
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          <Text style={styles.sectionSubtitle}>
            Select the days when you have this subject
          </Text>
          <WeeklyScheduleSelector
            selectedDays={selectedDays}
            onDayToggle={handleDayToggle}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Updating...' : 'Update Subject'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 55,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  descriptionIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#333',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200EE',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
});