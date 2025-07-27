import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Shield, Lock, Eye, Database, Trash2, FileText, ChevronRight, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function PrivacySecurityScreen() {
  const { theme } = useTheme();

  const SecurityItem = ({ 
    icon, 
    title, 
    description, 
    onPress 
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity 
      style={[styles.securityItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.securityContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.securityTitle, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.securityDescription, { color: theme.colors.onSurface + '80' }]}>
            {description}
          </Text>
        </View>
      </View>
      {onPress && <ChevronRight size={16} color={theme.colors.onSurface + '60'} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline
      }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Data Protection
          </Text>
          
          <SecurityItem
            icon={<Database size={20} color={theme.colors.primary} />}
            title="Data Storage"
            description="Your data is stored locally on your device and never shared with third parties"
          />
          
          <SecurityItem
            icon={<Lock size={20} color={theme.colors.success} />}
            title="Encryption"
            description="All sensitive data is encrypted using industry-standard security protocols"
          />
          
          <SecurityItem
            icon={<Eye size={20} color={theme.colors.info} />}
            title="Privacy Controls"
            description="You have full control over what data is collected and how it's used"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Data Management
          </Text>
          
          <SecurityItem
            icon={<FileText size={20} color={theme.colors.primary} />}
            title="Export Data"
            description="Download a copy of all your attendance and subject data"
            onPress={() => {}}
          />
          
          <SecurityItem
            icon={<Trash2 size={20} color={theme.colors.error} />}
            title="Clear All Data"
            description="Permanently delete all your data from this device"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Legal & Compliance
          </Text>
          
          <SecurityItem
            icon={<FileText size={20} color={theme.colors.primary} />}
            title="Privacy Policy"
            description="Read our privacy policy and data handling practices"
            onPress={() => {}}
          />
          
          <SecurityItem
            icon={<FileText size={20} color={theme.colors.primary} />}
            title="Terms of Service"
            description="Review the terms and conditions for using this app"
            onPress={() => {}}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Shield size={24} color={theme.colors.primary} />
          <Text style={[styles.infoTitle, { color: theme.colors.onSurface }]}>
            Your Privacy Matters
          </Text>
          <Text style={[styles.infoDescription, { color: theme.colors.onSurface + '80' }]}>
            We are committed to protecting your privacy. This app operates entirely offline, 
            and your data never leaves your device unless you explicitly choose to export it.
          </Text>
        </View>

        <View style={[styles.warningCard, { 
          backgroundColor: theme.colors.surface,
          borderLeftColor: theme.colors.warning
        }]}>
          <AlertCircle size={20} color={theme.colors.warning} />
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, { color: theme.colors.warning }]}>
              Data Backup Reminder
            </Text>
            <Text style={[styles.warningDescription, { color: theme.colors.onSurface + '80' }]}>
              Since your data is stored locally, make sure to regularly export your data 
              to prevent loss if you uninstall the app or change devices.
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
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 16,
    paddingTop: 12
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 18,
  },
  infoCard: {
    alignItems: 'center',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  warningContent: {
    marginLeft: 12,
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  warningDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 18,
  },
});