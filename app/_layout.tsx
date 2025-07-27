import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function RootLayout() {
  useFrameworkReady();
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  useEffect(() => {
    const hideSplash = async () => {
      try {
        
        setTimeout(() => {
          setIsReady(true);
        }, 2000);
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
        setTimeout(() => {
          setIsReady(true);
        }, 2000);
      }
    };

    hideSplash();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <AttendanceProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </NotificationProvider>
      </AttendanceProvider>
    </ThemeProvider>
  );
}