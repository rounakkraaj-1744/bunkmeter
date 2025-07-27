import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { TrendingUp, Calendar } from 'lucide-react-native';

const splashColors = {
  primary: '#6200EE',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  onBackground: '#333333',
  onSurface: '#333333',
  outline: '#E0E0E0',
};

export const SplashScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const loadingScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(loadingScaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: splashColors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconContainer, { 
          backgroundColor: splashColors.surface,
          shadowColor: splashColors.primary
        }]}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>
        <Animated.Text
          style={[
            styles.title, 
            { color: splashColors.onBackground },
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
        >
          BunkMeter
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            { color: splashColors.onBackground + '80' },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          numberOfLines={2}
          
        >
          Track your academic journey
        </Animated.Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.featuresContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.feature, { backgroundColor: splashColors.surface }]}>
          <Calendar size={24} color={splashColors.primary} />
          <Text style={[styles.featureText, { color: splashColors.onSurface }]} numberOfLines={2}>
            Smart Calendar
          </Text>
        </View>
        <View style={[styles.feature, { backgroundColor: splashColors.surface }]}>
          <TrendingUp size={24} color={splashColors.primary} />
          <Text style={[styles.featureText, { color: splashColors.onSurface }]} numberOfLines={2}>
            Progress Analytics
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <View style={[styles.loadingBar, { backgroundColor: splashColors.outline }]}>
          <Animated.View
            style={[
              styles.loadingFill,
              { backgroundColor: splashColors.primary },
              {
                transform: [{ scaleX: loadingScaleAnim }],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  appIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    width: '100%',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  feature: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
    maxWidth: 120,
  },
  featureText: {
    fontSize: 11,
    fontFamily: 'Roboto-Medium',
    marginTop: 8,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loadingBar: {
    width: '60%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
});