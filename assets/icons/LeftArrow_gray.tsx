import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LeftArrowGrayProps {
  width?: number;
  height?: number;
  color?: string;
}

export const LeftArrowGray: React.FC<LeftArrowGrayProps> = ({ 
  width = 29, 
  height = 29, 
  color = '#AEABAB' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 29 29" fill="none">
      <Path 
        d="M7.93934 12.9393C7.35355 13.5251 7.35355 14.4749 7.93934 15.0607L17.4853 24.6066C18.0711 25.1924 19.0208 25.1924 19.6066 24.6066C20.1924 24.0208 20.1924 23.0711 19.6066 22.4853L11.1213 14L19.6066 5.51472C20.1924 4.92893 20.1924 3.97918 19.6066 3.3934C19.0208 2.80761 18.0711 2.80761 17.4853 3.3934L7.93934 12.9393ZM10 14L10 12.5L9 12.5L9 14L9 15.5L10 15.5L10 14Z" 
        fill={color}
      />
    </Svg>
  );
};

export default LeftArrowGray;

