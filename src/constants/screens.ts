// 인증 관련 화면
export const AUTH_SCREENS = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  SIGNUP: 'Register', // SIGNUP을 REGISTER와 동일하게 매핑
  FORGOT_PASSWORD: 'ForgotPassword',
} as const;

// 메인 탭 화면
export const MAIN_TABS = {
  HOME: 'Home',
  BOOKINGS: 'Bookings',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
} as const;

// 홈 관련 화면
export const HOME_SCREENS = {
  HOME_MAIN: 'HomeMain',
  SPORT_DETAIL: 'SportDetail',
  LESSON_DETAIL: 'LessonDetail',
  INSTRUCTOR_PROFILE: 'InstructorProfile',
} as const;

// 검색 관련 화면
export const SEARCH_SCREENS = {
  SEARCH_MAIN: 'SearchMain',
  SEARCH_RESULTS: 'SearchResults',
  FILTERS: 'Filters',
} as const;

// 예약 관련 화면
export const BOOKING_SCREENS = {
  BOOKINGS_MAIN: 'BookingsMain',
  BOOKING_DETAIL: 'BookingDetail',
  CREATE_BOOKING: 'CreateBooking',
  PAYMENT: 'Payment',
  SCHEDULE_LIST: 'ScheduleList',
  SPORT_LIST: 'SportList',
  BOOKING_CONFIRM: 'BookingConfirm',
} as const;

// 프로필 관련 화면
export const PROFILE_SCREENS = {
  PROFILE_MAIN: 'ProfileMain',
  EDIT_PROFILE: 'EditProfile',
  MY_LESSONS: 'MyLessons',
  MY_REVIEWS: 'MyReviews',
  SETTINGS: 'Settings',
} as const;

// 수업 관련 화면
export const LESSON_SCREENS = {
  CREATE_LESSON: 'CreateLesson',
  EDIT_LESSON: 'EditLesson',
  LESSON_MANAGEMENT: 'LessonManagement',
  INSTRUCTOR_VERIFY: 'InstructorVerify',
  CREATE_LESSON_INFO: 'CreateLessonInfo',
  CREATE_LESSON_COMPLETE: 'CreateLessonComplete',
  OPEN_LESSONS: 'OpenLessons',
} as const;

// 관심수업 관련 화면
export const FAVORITES_SCREENS = {
  FAVORITES_MAIN: 'FavoritesMain',
  FAVORITE_LESSON_DETAIL: 'FavoriteLessonDetail',
} as const;

// 모든 화면 이름을 하나의 객체로 통합
export const SCREENS = {
  ...AUTH_SCREENS,
  ...MAIN_TABS,
  ...HOME_SCREENS,
  ...FAVORITES_SCREENS,
  ...BOOKING_SCREENS,
  ...PROFILE_SCREENS,
  ...LESSON_SCREENS,
} as const;

// 화면 이름 타입
export type ScreenName = typeof SCREENS[keyof typeof SCREENS];
