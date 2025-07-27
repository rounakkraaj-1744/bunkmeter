import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface ThemeColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  outline: string;
  shadow: string;
  success: string;
  warning: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#6200EE',
    primaryVariant: '#3700B3',
    secondary: '#03DAC6',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    error: '#FF5252',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onBackground: '#333333',
    onSurface: '#333333',
    onError: '#FFFFFF',
    outline: '#E0E0E0',
    shadow: '#000000',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#BB86FC',
    primaryVariant: '#6200EE',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    error: '#CF6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
    outline: '#3C3C3C',
    shadow: '#000000',
    success: '#81C784',
    warning: '#FFD54F',
    info: '#64B5F6',
  },
};

interface ThemeState {
  theme: Theme;
  isLoading: boolean;
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: ThemeState = {
  theme: lightTheme,
  isLoading: true,
};

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme.isDark ? lightTheme : darkTheme };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface ThemeContextType {
  theme: Theme;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const storeTheme = async (isDark: boolean) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } else {
      await SecureStore.setItemAsync('theme', isDark ? 'dark' : 'light');
    }
  } catch (error) {
    console.error('Error storing theme:', error);
  }
};

const getStoredTheme = async (): Promise<boolean> => {
  try {
    let storedTheme: string | null;
    if (Platform.OS === 'web') {
      storedTheme = localStorage.getItem('theme');
    }
    else {
      storedTheme = await SecureStore.getItemAsync('theme');
    }
    return storedTheme === 'dark';
  }
  catch (error) {
    console.error('Error getting stored theme:', error);
    return false;
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const isDark = await getStoredTheme();
      dispatch({ type: 'SET_THEME', payload: isDark ? darkTheme : lightTheme });
    }
    catch (error) {
      console.error('Error loading theme:', error);
    }
    finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = state.theme.isDark ? lightTheme : darkTheme;
      dispatch({ type: 'SET_THEME', payload: newTheme });
      await storeTheme(newTheme.isDark);
    }
    catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const setTheme = async (theme: Theme) => {
    try {
      dispatch({ type: 'SET_THEME', payload: theme });
      await storeTheme(theme.isDark);
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme: state.theme,
      isLoading: state.isLoading,
      toggleTheme,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};