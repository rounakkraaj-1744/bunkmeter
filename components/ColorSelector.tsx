import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  '#E3F2FD', '#FCE4EC', '#E8F5E8', '#FFF3E0',
  '#F3E5F5', '#E0F2F1', '#FFF8E1', '#FFEBEE',
  '#E1F5FE', '#F9FBE7', '#FFFDE7', '#EDE7F6',
];

export const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onColorSelect }) => {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onColorSelect(color)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#6200EE',
    borderWidth: 3,
  },
});