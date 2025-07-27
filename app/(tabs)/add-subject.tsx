import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ColorSelector } from '@/components/ColorSelector';
import { WeeklyScheduleSelector } from '@/components/WeeklyScheduleSelector';
import { Check, ArrowLeft, Clock } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function AddSubjectScreen() {
  const { createSubject } = useAttendance();
  const { theme } = useTheme();
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#E3F2FD');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      await createSubject({
        name: subjectName.trim(),
        description: description.trim(),
        color: selectedColor,
        weeklySchedule: selectedDays,
      });
      router.back();
    }
    catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create subject');
    }
    finally {
      setIsLoading(false);
    }
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
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Add Subject</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          <Check size={24} color={isLoading ? theme.colors.onSurface + '60' : theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Subject Name</Text>
          <TextInput
            style={[styles.textInput, { 
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              borderColor: theme.colors.outline
            }]}
            value={subjectName}
            onChangeText={setSubjectName}
            placeholder="Enter subject name"
            placeholderTextColor={theme.colors.onSurface + '60'}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Description</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.onBackground + '80' }]}>
            Add timing, teacher name, or any other details
          </Text>
          <View style={[styles.descriptionContainer, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline
          }]}>
            <Clock size={20} color={theme.colors.onSurface + '80'} style={styles.descriptionIcon} />
            <TextInput style={[styles.descriptionInput, { color: theme.colors.onSurface }]} value={description} onChangeText={setDescription}
              placeholder="e.g., Mon-Wed-Fri 9:00 AM, Prof. Smith" placeholderTextColor={theme.colors.onSurface + '60'} multiline />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Color Tag</Text>
          <ColorSelector selectedColor={selectedColor} onColorSelect={setSelectedColor}/>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Weekly Schedule</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.colors.onBackground + '80' }]}>
            Select the days when you have this subject
          </Text>
          <WeeklyScheduleSelector selectedDays={selectedDays} onDayToggle={handleDayToggle}/>
        </View>
      </ScrollView>

      <View style={[styles.footer, { 
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline
      }]}>
        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: isLoading ? theme.colors.onSurface + '40' : theme.colors.primary
          }]} onPress={handleSave} disabled={isLoading}>
          <Check size={20} color={theme.colors.onPrimary} />
          <Text style={[styles.saveButtonText, { color: theme.colors.onPrimary }]}>
            {isLoading ? 'Creating...' : 'Create Subject'}
          </Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 55,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 12,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    borderWidth: 1,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  descriptionIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    minHeight: 40,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
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
});