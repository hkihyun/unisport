import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SearchIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = 22, 
  color = '#FEFEFE', 
  strokeWidth = 2 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path 
        d="M19.25 19.25L14.4864 14.4864M14.4864 14.4864C15.7305 13.2422 16.5 11.5235 16.5 9.625C16.5 5.82804 13.422 2.75 9.625 2.75C5.82804 2.75 2.75 5.82804 2.75 9.625C2.75 13.422 5.82804 16.5 9.625 16.5C11.5235 16.5 13.2422 15.7305 14.4864 14.4864Z" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
