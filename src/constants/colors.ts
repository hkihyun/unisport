// 앱 색상 테마
export const COLORS = {
  // 기본 색상
  PRIMARY: '#4A90E2',
  PRIMARY_DARK: '#357ABD',
  PRIMARY_LIGHT: '#7BB3F0',
  
  // 보조 색상
  SECONDARY: '#F5A623',
  SECONDARY_DARK: '#D6891F',
  SECONDARY_LIGHT: '#F7C668',
  
  // 성공/에러 색상
  SUCCESS: '#7ED321',
  ERROR: '#D0021B',
  WARNING: '#F5A623',
  INFO: '#4A90E2',
  
  // 그레이 스케일
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#FAFAFA',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#EEEEEE',
  GRAY_300: '#E0E0E0',
  GRAY_400: '#BDBDBD',
  GRAY_500: '#9E9E9E',
  GRAY_600: '#757575',
  GRAY_700: '#616161',
  GRAY_800: '#424242',
  GRAY_900: '#212121',
  
  // 배경 색상
  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F8F9FA',
  BACKGROUND_TERTIARY: '#F1F3F4',
  
  // 텍스트 색상
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  TEXT_TERTIARY: '#9E9E9E',
  TEXT_INVERSE: '#FFFFFF',
  
  // 테두리 색상
  BORDER: '#E0E0E0',
  BORDER_LIGHT: '#F5F5F5',
  BORDER_DARK: '#BDBDBD',
  
  // 그림자 색상
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.2)',
  
  // 투명도
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
} as const;

// 색상 타입
export type ColorKey = keyof typeof COLORS;
