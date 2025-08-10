// 앱 색상 테마 - 현대적이고 세련된 디자인
export const COLORS = {
  // 기본 색상 - 모던한 블루 계열
  PRIMARY: '#2563EB',
  PRIMARY_DARK: '#1D4ED8',
  PRIMARY_LIGHT: '#3B82F6',
  PRIMARY_SUBTLE: '#DBEAFE',
  
  // 보조 색상 - 세련된 그린 계열
  SECONDARY: '#10B981',
  SECONDARY_DARK: '#059669',
  SECONDARY_LIGHT: '#34D399',
  SECONDARY_SUBTLE: '#D1FAE5',
  
  // 액센트 색상
  ACCENT: '#8B5CF6',
  ACCENT_DARK: '#7C3AED',
  ACCENT_LIGHT: '#A78BFA',
  ACCENT_SUBTLE: '#EDE9FE',
  
  // 성공/에러 색상
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  
  // 그레이 스케일 - 모던한 그레이
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  
  // 배경 색상
  BACKGROUND: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F9FAFB',
  BACKGROUND_TERTIARY: '#F3F4F6',
  BACKGROUND_CARD: '#FFFFFF',
  
  // 텍스트 색상
  TEXT_PRIMARY: '#111827',
  TEXT_SECONDARY: '#4B5563',
  TEXT_TERTIARY: '#6B7280',
  TEXT_INVERSE: '#FFFFFF',
  TEXT_MUTED: '#9CA3AF',
  
  // 테두리 색상
  BORDER: '#E5E7EB',
  BORDER_LIGHT: '#F3F4F6',
  BORDER_DARK: '#D1D5DB',
  BORDER_FOCUS: '#3B82F6',
  
  // 그림자 색상
  SHADOW: 'rgba(0, 0, 0, 0.05)',
  SHADOW_MEDIUM: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.15)',
  SHADOW_CARD: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  SHADOW_LARGE: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  
  // 투명도
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
  
  // 그라데이션
  GRADIENT_PRIMARY: ['#2563EB', '#1D4ED8'],
  GRADIENT_SECONDARY: ['#10B981', '#059669'],
  GRADIENT_ACCENT: ['#8B5CF6', '#7C3AED'],
} as const;

// 색상 타입
export type ColorKey = keyof typeof COLORS;
