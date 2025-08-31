// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  university: string;
  major?: string;
  grade?: number;
  studentNumber?: string; // 학번 필드 추가
  bio?: string;
  rating: number;
  reviewCount: number;
  isInstructor?: boolean; // 강사 여부 필드 추가
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

// 레슨 생성 요청 타입
export interface CreateLessonRequest {
  sport: string;
  title: string;
  description: string;
  level: number;
  location: string;
  instructorUserId: number;
  lessonDate: string;
  lessonTime: string;
}

// 레슨 생성 응답 타입
export interface CreateLessonResponse {
  id: number;
  sport: string;
  title: string;
  description: string;
  level: number;
  location: string;
  instructorUserId: number;
  lessonDate: string;
  lessonTime: string;
}

// 백엔드 API 레슨 타입 (GET /lessons/all 응답)
export interface BackendLesson {
  id: number;
  sport: string;
  title: string;
  description: string;
  level: number;
  location: string;
  image: string | null;
  instructorUserId: number;
  lessonDate: string;
  lessonTime: string;
}

// 백엔드 API 수업 상세 타입 (GET /lessons/{id} 응답)
export interface BackendLessonDetail {
  id: number | null;
  sport: string;
  title: string;
  description: string;
  level: number;
  location: string;
  imagePath: string | null; // API 응답과 일치하도록 image -> imagePath로 변경
  capacity: number; // API 응답에 있는 필드 추가
  reservedCount: number; // API 응답에 있는 필드 추가
  reservationStatus: 'AVAILABLE' | 'FULL' | 'CLOSED'; // API 응답에 있는 필드 추가
  isEveryWeek: number; // API 응답에 있는 필드 추가
  dayOfTheWeek: string; // API 응답에 있는 필드 추가
  instructorUserId: number;
  lessonDate: string;
  lessonTime: string;
}

// 백엔드 API 리뷰 타입 (GET /review/rating/{lessonId}, GET /review/latest/{lessonId} 응답)
export interface BackendReview {
  id: number;
  lessonId: number;
  rating: number;
  reviewContent: string;
  createdAt: string;
  userId: number;
}

export interface BackendReviewResponse {
  content: BackendReview[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// 백엔드 API 예약 타입 (GET /reservations/{userId} 응답)
export interface BackendReservation {
  id: number;
  userId: number;
  lessonId: number;
  createdAt: string;
}

// 백엔드 API 예약 생성 요청 타입 (POST /reservations)
export interface CreateReservationRequest {
  userId: number;
  lessonId: number;
}

// 백엔드 API 예약 생성 응답 타입 (POST /reservations)
export interface CreateReservationResponse {
  id: number;
  userId: number;
  lessonId: number;
  createdAt: string;
}

// 백엔드 API 예약 목록 응답 타입 (GET /reservations/{userId} 응답)
export interface BackendReservationResponse {
  content: BackendReservation[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
