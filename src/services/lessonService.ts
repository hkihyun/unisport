import { apiClient, API_ENDPOINTS } from './api';
import { Lesson, ApiResponse, PaginatedResponse, PaginationParams, LessonFilters } from '../types';

// 수업 생성 요청 데이터
export interface CreateLessonRequest {
  title: string;
  description: string;
  sportId: string;
  price: number;
  duration: number;
  maxStudents: number;
  location: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  schedules: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

// 수업 업데이트 요청 데이터
export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  status?: 'active' | 'inactive' | 'completed';
}

// 수업 검색 요청 데이터
export interface SearchLessonsRequest extends PaginationParams {
  filters?: LessonFilters;
  sortBy?: 'price' | 'date' | 'rating' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// 수업 서비스 클래스
export class LessonService {
  // 모든 수업 조회
  static async getLessons(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Lesson>>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    return apiClient.get<PaginatedResponse<Lesson>>(`${API_ENDPOINTS.LESSONS.BASE}?${queryParams}`);
  }

  // 수업 검색
  static async searchLessons(params: SearchLessonsRequest): Promise<ApiResponse<PaginatedResponse<Lesson>>> {
    return apiClient.post<PaginatedResponse<Lesson>>(API_ENDPOINTS.LESSONS.SEARCH, params);
  }

  // 특정 수업 조회
  static async getLessonById(lessonId: string): Promise<ApiResponse<Lesson>> {
    return apiClient.get<Lesson>(`${API_ENDPOINTS.LESSONS.BASE}/${lessonId}`);
  }

  // 수업 생성
  static async createLesson(lessonData: CreateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiClient.post<Lesson>(API_ENDPOINTS.LESSONS.CREATE, lessonData, true);
  }

  // 수업 업데이트
  static async updateLesson(lessonId: string, lessonData: UpdateLessonRequest): Promise<ApiResponse<Lesson>> {
    return apiClient.put<Lesson>(`${API_ENDPOINTS.LESSONS.BASE}/${lessonId}`, lessonData, true);
  }

  // 수업 삭제
  static async deleteLesson(lessonId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.LESSONS.BASE}/${lessonId}`, true);
  }

  // 강사별 수업 조회
  static async getLessonsByInstructor(instructorId: string, params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Lesson>>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    return apiClient.get<PaginatedResponse<Lesson>>(`${API_ENDPOINTS.LESSONS.BY_INSTRUCTOR}/${instructorId}?${queryParams}`, true);
  }

  // 스포츠별 수업 조회
  static async getLessonsBySport(sportId: string, params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Lesson>>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    return apiClient.get<PaginatedResponse<Lesson>>(`${API_ENDPOINTS.LESSONS.BY_SPORT}/${sportId}?${queryParams}`);
  }

  // 내가 생성한 수업 조회
  static async getMyLessons(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Lesson>>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });
    return apiClient.get<PaginatedResponse<Lesson>>(`${API_ENDPOINTS.LESSONS.BY_INSTRUCTOR}/me?${queryParams}`, true);
  }
}
