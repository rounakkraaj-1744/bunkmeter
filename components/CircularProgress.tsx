import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  textColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size,
  strokeWidth,
  color,
  textColor = '#333',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          dy="0.3em"
          fontSize="14"
          fontFamily="Roboto-Bold"
          fill={textColor}
        >
          {percentage}%
        </SvgText>
      </Svg>
    </View>
  );
};