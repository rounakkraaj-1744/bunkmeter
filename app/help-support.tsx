import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, CircleHelp as HelpCircle, MessageCircle, Mail, Bug, ChevronRight, ExternalLink } from 'lucide-react-native';

export default function HelpSupportScreen() {
  const { theme } = useTheme();

  const handleEmailSupport = () => {
    Linking.openURL('mailto:rocky.coder745@gmail.com?subject=Support Request');
  };

  const handleReportBug = () => {
    Linking.openURL('mailto:rocky.coder745@gmail.com?subject=Bug Report');
  };

  const SupportItem = ({ icon, title, description, onPress, external = false }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress?: () => void;
    external?: boolean;
  }) => (
    <TouchableOpacity style={[styles.supportItem, { backgroundColor: theme.colors.surface }]} onPress={onPress}>
      <View style={styles.supportContent}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.supportTitle, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text style={[styles.supportDescription, { color: theme.colors.onSurface + '80' }]}>
            {description}
          </Text>
        </View>
      </View>
      {external ? (
        <ExternalLink size={16} color={theme.colors.onSurface + '60'} />
      ) : (
        onPress && <ChevronRight size={16} color={theme.colors.onSurface + '60'} />
      )}
    </TouchableOpacity>
  );

  const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <View style={[styles.faqItem, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.faqQuestion, { color: theme.colors.onSurface }]}>
        {question}
      </Text>
      <Text style={[styles.faqAnswer, { color: theme.colors.onSurface + '80' }]}>
        {answer}
      </Text>
    </View>
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
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Get Help
          </Text>
          
          <SupportItem icon={<Mail size={20} color={theme.colors.primary} />} title="Email Support" description="Get help from our support team via email" onPress={handleEmailSupport} external/>
          
          <SupportItem icon={<MessageCircle size={20} color={theme.colors.success} />} title="Live Chat" description="Chat with our support team in real-time" onPress={() => {}}/>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Feedback
          </Text>
          
          <SupportItem icon={<Bug size={20} color={theme.colors.error} />} title="Report a Bug" description="Found an issue? Let us know so we can fix it" onPress={handleReportBug} external/>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
            Frequently Asked Questions
          </Text>
          
          <FAQItem
            question="How do I mark attendance for multiple classes in one day?"
            answer="When marking attendance, you can adjust the 'Number of Classes' field to indicate how many classes you attended that day."
          />
          
          <FAQItem
            question="Can I edit attendance after marking it?"
            answer="Yes! Simply tap on the date in the calendar view and you can modify the attendance status, notes, or assignments."
          />
          
          <FAQItem
            question="What happens if my attendance drops below 75%?"
            answer="The app will show a warning badge on the subject card and include it in the low attendance alerts section in your statistics."
          />
          
          <FAQItem
            question="How do I backup my data?"
            answer="Your data is stored locally on your device. You can export your data from the Privacy & Security settings to create a backup."
          />
          
          <FAQItem
            question="Can I use this app on multiple devices?"
            answer="Currently, the app stores data locally on each device. You can export data from one device and import it to another manually."
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <HelpCircle size={24} color={theme.colors.primary} />
          <Text style={[styles.infoTitle, { color: theme.colors.onSurface }]}>
            Need More Help?
          </Text>
          <Text style={[styles.infoDescription, { color: theme.colors.onSurface + '80' }]}>
            Can't find what you're looking for? Our support team is here to help. 
            Reach out via email or live chat and we'll get back to you as soon as possible.
          </Text>
        </View>

        <View style={[styles.versionCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.versionText, { color: theme.colors.onSurface + '60' }]}>
            BunkMeter v1.0.0
          </Text>
          <Text style={[styles.versionText, { color: theme.colors.onSurface + '60' }]}>
            Built with ❤️ for students
          </Text>
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
  supportItem: {
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
  supportContent: {
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
  supportTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    lineHeight: 18,
  },
  faqItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 8,
  },
  faqAnswer: {
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
  versionCard: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
});