import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Mail, CreditCard as Edit3, Save, X, ArrowLeft, Camera } from 'lucide-react-native';

export default function ProfileSettingsScreen() {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('Student');
  const [editEmail, setEditEmail] = useState('student@example.com');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditName('Student');
    setEditEmail('student@example.com');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Profile Settings</Text>
        {!isEditing ? (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Edit3 size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <X size={20} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              disabled={isLoading}
            >
              <Save size={20} color={theme.colors.onPrimary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.avatarText, { color: theme.colors.onPrimary }]}>
                {getInitials(editName)}
              </Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
                <Camera size={16} color={theme.colors.onPrimary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoRow}>
              <User size={20} color={theme.colors.onSurface + '80'} />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurface + '80' }]}>Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.editInput, { 
                  color: theme.colors.onSurface,
                  borderBottomColor: theme.colors.outline
                }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.onSurface + '60'}
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{editName}</Text>
            )}
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.infoRow}>
              <Mail size={20} color={theme.colors.onSurface + '80'} />
              <Text style={[styles.infoLabel, { color: theme.colors.onSurface + '80' }]}>Email</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={[styles.editInput, { 
                  color: theme.colors.onSurface,
                  borderBottomColor: theme.colors.outline
                }]}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.onSurface + '60'}
              />
            ) : (
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>{editEmail}</Text>
            )}
          </View>
        </View>

        <View style={styles.dangerZone}>
          <Text style={[styles.sectionTitle, { color: theme.colors.error }]}>Danger Zone</Text>
          <TouchableOpacity style={[styles.dangerButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.error
          }]}>
            <Text style={[styles.dangerButtonText, { color: theme.colors.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    padding: 8,
  },
  saveButton: {
    borderRadius: 8,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  editInput: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  dangerZone: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
  },
  dangerButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});