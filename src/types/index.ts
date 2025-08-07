// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  university: string;
  major?: string;
  grade?: number;
  bio?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 스포츠 관련 타입
export interface Sport {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// 수업 관련 타입
export interface Lesson {
  id: string;
  title: string;
  description: string;
  sportId: string;
  sport: Sport;
  instructorId: string;
  instructor: User;
  price: number;
  duration: number; // 분 단위
  maxStudents: number;
  currentStudents: number;
  location: string;
  schedule: LessonSchedule[];
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'inactive' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// 수업 일정 타입
export interface LessonSchedule {
  id: string;
  lessonId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

// 예약 관련 타입
export interface Booking {
  id: string;
  lessonId: string;
  lesson: Lesson;
  studentId: string;
  student: User;
  scheduleId: string;
  schedule: LessonSchedule;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

// 리뷰 관련 타입
export interface Review {
  id: string;
  lessonId: string;
  lesson: Lesson;
  reviewerId: string;
  reviewer: User;
  instructorId: string;
  instructor: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 필터링 타입
export interface LessonFilters {
  sportId?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  date?: string;
}
