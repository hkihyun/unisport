import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface HeartIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ 
  size = 28, 
  color = '#5981FA',
  strokeWidth = 2,
  filled = false
}) => {
  if (filled) {
    // 채워진 하트 (사용자가 제공한 SVG 기반)
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Path 
          d="M28 11C28 7.68629 25.2018 5 21.75 5C19.1692 5 16.9537 6.5017 16 8.64456C15.0463 6.5017 12.8308 5 10.25 5C6.79822 5 4 7.68629 4 11C4 20.6274 16 27 16 27C16 27 28 20.6274 28 11Z" 
          stroke={color} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <Ellipse cx="10.5" cy="11" rx="6.5" ry="6" fill={color} />
        <Ellipse cx="21.5" cy="11" rx="6.5" ry="6" fill={color} />
        <Ellipse cx="11.5" cy="15" rx="6.5" ry="6" fill={color} />
        <Ellipse cx="20.5" cy="15" rx="6.5" ry="6" fill={color} />
        <Ellipse cx="16" cy="19.5" rx="7" ry="6.5" fill={color} />
      </Svg>
    );
  }

  // Outline 하트 (기존)
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M24.5 9.62497C24.5 6.72547 22.0516 4.37497 19.0312 4.37497C16.773 4.37497 14.8345 5.68896 14 7.56396C13.1655 5.68896 11.227 4.37497 8.96875 4.37497C5.94844 4.37497 3.5 6.72547 3.5 9.62497C3.5 18.049 14 23.625 14 23.625C14 23.625 24.5 18.049 24.5 9.62497Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HeartIcon;
