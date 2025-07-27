import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, CircleHelp as HelpCircle, Moon, Sun, BookOpen, ChevronRight} from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  
  const handlePrivacySecurity = () => {
    router.push('/privacy-security');
  };

  const handleHelpSupport = () => {
    router.push('/help-support');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline
      }]}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Account</Text>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Preferences</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.surface }]} 
            onPress={toggleTheme}
          >
            {theme.isDark ? (
              <Sun size={20} color={theme.colors.onSurface + '80'} />
            ) : (
              <Moon size={20} color={theme.colors.onSurface + '80'} />
            )}
            <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>
              {theme.isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
            <View style={styles.spacer} />
            <View style={[
              styles.themeToggle,
              { backgroundColor: theme.isDark ? theme.colors.primary : theme.colors.outline }
            ]}>
              <View style={[
                styles.themeToggleThumb,
                { 
                  backgroundColor: theme.colors.surface,
                  transform: [{ translateX: theme.isDark ? 20 : 2 }]
                }
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>Support</Text>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.surface }]} 
            onPress={handlePrivacySecurity}
          >
            <Shield size={20} color={theme.colors.onSurface + '80'} />
            <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>Privacy & Security</Text>
            <View style={styles.spacer} />
            <ChevronRight size={16} color={theme.colors.onSurface + '60'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.surface }]} 
            onPress={handleHelpSupport}
          >
            <HelpCircle size={20} color={theme.colors.onSurface + '80'} />
            <Text style={[styles.menuText, { color: theme.colors.onSurface }]}>Help & Support</Text>
            <View style={styles.spacer} />
            <ChevronRight size={16} color={theme.colors.onSurface + '60'} />
          </TouchableOpacity>
        </View>

        <View style={styles.aboutSection}>
          <View style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
            <BookOpen size={32} color={theme.colors.primary} />
            <Text style={[styles.aboutTitle, { color: theme.colors.onSurface }]}>
              BunkMeter
            </Text>
            <Text style={[styles.aboutDescription, { color: theme.colors.onSurface + '80' }]}>
              Keep track of your academic progress with ease. Monitor attendance, view statistics, and stay organized throughout your academic journey.
            </Text>
            <Text style={[styles.version, { color: theme.colors.onSurface + '60' }]}>
              Version 1.0.0
            </Text>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 55,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
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
    marginBottom: 16,
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
  userName: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 16,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  providerText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    paddingTop: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginLeft: 16,
  },
  spacer: {
    flex: 1,
  },
  themeToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  themeToggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
  },
  aboutSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  aboutCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  aboutDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  version: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
});