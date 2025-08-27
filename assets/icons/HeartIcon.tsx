import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HeartIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ 
  size = 28, 
  color = '#5981FA',
  strokeWidth = 2 
}) => {
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
