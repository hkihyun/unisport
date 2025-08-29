import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, TouchableOpacity } from 'react-native';

interface DifficultyIconProps {
  width?: number;
  height?: number;
  filled?: boolean;
  color?: string;
}

export const DifficultyIcon: React.FC<DifficultyIconProps> = ({
  width = 28,
  height = 24,
  filled = false,
  color = '#5981FA'
}) => {
  if (filled) {
    // 색깔이 있는 세모 (채워진 세모)
    return (
      <Svg width={width} height={height} viewBox="0 0 28 24" fill="none">
        <Path
          d="M12.268 0.999998C13.0378 -0.333335 14.9622 -0.333333 15.732 1L26.9904 20.5C27.7602 21.8333 26.7979 23.5 25.2583 23.5H2.74167C1.20207 23.5 0.239818 21.8333 1.00962 20.5L12.268 0.999998Z"
          fill={color}
        />
      </Svg>
    );
  } else {
    // 색깔이 없는 세모 (빈 세모)
    return (
      <Svg width={width} height={height} viewBox="0 0 27 24" fill="none">
        <Path
          d="M11.7553 1.11355C12.5191 -0.249523 14.4809 -0.249522 15.2447 1.11355L26.1208 20.5223C26.8679 21.8555 25.9043 23.5 24.3761 23.5H2.62393C1.09571 23.5 0.132124 21.8555 0.879191 20.5223L11.7553 1.11355Z"
          fill="#D0DEEC"
        />
      </Svg>
    );
  }
};

// 난이도별로 세모 개수를 표시하는 컴포넌트
interface DifficultyLevelProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: number;
  color?: string;
  onLevelPress?: (selectedLevel: 1 | 2 | 3 | 4 | 5) => void;
}

export const DifficultyLevel: React.FC<DifficultyLevelProps> = ({
  level,
  size = 16,
  color = '#5981FA',
  onLevelPress
}) => {
  const handlePress = (selectedLevel: 1 | 2 | 3 | 4 | 5) => {
    if (onLevelPress) {
      onLevelPress(selectedLevel);
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index as 1 | 2 | 3 | 4 | 5)}
          style={{ padding: 2 }}
        >
          <Svg width={size} height={size} viewBox="0 0 28 24" fill="none">
            <Path
              d={index <= level 
                ? "M12.268 0.999998C13.0378 -0.333335 14.9622 -0.333333 15.732 1L26.9904 20.5C27.7602 21.8333 26.7979 23.5 25.2583 23.5H2.74167C1.20207 23.5 0.239818 21.8333 1.00962 20.5L12.268 0.999998Z"
                : "M11.7553 1.11355C12.5191 -0.249523 14.4809 -0.249522 15.2447 1.11355L26.1208 20.5223C26.8679 21.8555 25.9043 23.5 24.3761 23.5H2.62393C1.09571 23.5 0.132124 21.8555 0.879191 20.5223L11.7553 1.11355Z"
              }
              fill={index <= level ? color : "#D0DEEC"}
            />
          </Svg>
        </TouchableOpacity>
      ))}
    </View>
  );
};
