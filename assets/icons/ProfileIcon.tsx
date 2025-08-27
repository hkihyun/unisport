import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface ProfileIconProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  width = 105,
  height = 105,
  fill = '#5981FA',
  stroke = 'white'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 105 105" fill="none">
      <Path 
        d="M78.6692 81.921C72.678 74.0139 63.1855 68.9062 52.5 68.9062C41.8145 68.9062 32.322 74.0139 26.3308 81.921M78.6692 81.921C86.7716 74.709 91.875 64.2005 91.875 52.5C91.875 30.7538 74.2462 13.125 52.5 13.125C30.7538 13.125 13.125 30.7538 13.125 52.5C13.125 64.2005 18.2284 74.709 26.3308 81.921M78.6692 81.921C71.7128 88.113 62.5457 91.875 52.5 91.875C42.4543 91.875 33.2872 88.113 26.3308 81.921M65.625 42.6562C65.625 49.905 59.7487 55.7812 52.5 55.7812C45.2513 55.7812 39.375 49.905 39.375 42.6562C39.375 35.4075 45.2513 29.5312 52.5 29.5312C59.7487 29.5312 65.625 35.4075 65.625 42.6562Z" 
        stroke={stroke} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
};