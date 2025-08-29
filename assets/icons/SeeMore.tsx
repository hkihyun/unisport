import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SeeMoreIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export const SeeMoreIcon: React.FC<SeeMoreIconProps> = ({
  width = 26,
  height = 26,
  color = '#A7B1CD'
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 26" fill="none">
      <Path
        d="M9.34375 13C9.34375 13.2244 9.16187 13.4062 8.9375 13.4062C8.71313 13.4062 8.53125 13.2244 8.53125 13C8.53125 12.7756 8.71313 12.5938 8.9375 12.5938C9.16187 12.5938 9.34375 12.7756 9.34375 13ZM9.34375 13H8.9375M13.4062 13C13.4062 13.2244 13.2244 13.4062 13 13.4062C12.7756 13.4062 12.5938 13.2244 12.5938 13C12.5938 12.7756 12.7756 12.5938 13 12.5938C13.2244 12.5938 13.4062 12.7756 13.4062 13ZM13.4062 13H13M17.4688 13C17.4688 13.2244 17.2869 13.4062 17.0625 13.4062C16.8381 13.4062 16.6562 13.2244 16.6562 13C16.6562 12.7756 16.8381 12.5938 17.0625 12.5938C17.2869 12.5938 17.4688 12.7756 17.4688 13ZM17.4688 13H17.0625M22.75 13C22.75 18.3848 18.3848 22.75 13 22.75C7.61522 22.75 3.25 18.3848 3.25 13C3.25 7.61522 7.61522 3.25 13 3.25C18.3848 3.25 22.75 7.61522 22.75 13Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SeeMoreIcon;
