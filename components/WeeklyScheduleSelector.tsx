import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface WeeklyScheduleSelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyScheduleSelector: React.FC<WeeklyScheduleSelectorProps> = ({
  selectedDays,
  onDayToggle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {weekDays.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayChip,
              { 
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                borderColor: isSelected ? theme.colors.primary : theme.colors.outline
              }
            ]}
            onPress={() => onDayToggle(day)}
          >
            <Text
              style={[
                styles.dayText,
                { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  dayChip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});