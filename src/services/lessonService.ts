import { apiClient, API_ENDPOINTS } from './api';
import { Lesson, ApiResponse, PaginatedResponse, PaginationParams, LessonFilters, CreateLessonRequest as BackendCreateLessonRequest, CreateLessonResponse, BackendLesson, BackendLessonDetail, BackendReviewResponse } from '../types';

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
  // 모든 수업 조회 (백엔드 API 형식에 맞춤)
  static async getLessons(params: PaginationParams): Promise<ApiResponse<BackendLesson[]>> {
    return apiClient.get<BackendLesson[]>(API_ENDPOINTS.LESSONS.ALL);
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

  // 백엔드 API 형식에 맞는 레슨 생성 (POST /lesson)
  static async createLessonBackend(lessonData: BackendCreateLessonRequest): Promise<ApiResponse<CreateLessonResponse>> {
    return apiClient.post<CreateLessonResponse>(API_ENDPOINTS.LESSONS.CREATE, lessonData, true);
  }

  // 백엔드 API에서 직접 배열 반환하는 경우를 위한 함수
  static async getLessonsDirect(): Promise<BackendLesson[]> {
    try {
      console.log('getLessonsDirect 시작');
      const url = 'https://unisportserver.onrender.com/lessons/all';
      console.log('요청 URL:', url);
      
      const response = await fetch(url);
      console.log('응답 상태:', response.status, response.statusText);
      console.log('응답 헤더:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP 오류 응답:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('응답 데이터:', data);
      console.log('데이터 타입:', typeof data);
      console.log('배열 여부:', Array.isArray(data));
      
      if (Array.isArray(data)) {
        console.log('레슨 개수:', data.length);
        return data;
      } else {
        console.error('응답이 배열이 아님:', data);
        throw new Error('응답이 배열 형태가 아닙니다');
      }
    } catch (error) {
      console.error('getLessonsDirect 오류:', error);
      throw error;
    }
  }

  // 백업 방법: 다른 fetch 옵션으로 시도
  static async getLessonsBackup(): Promise<BackendLesson[]> {
    try {
      console.log('getLessonsBackup 시작');
      const url = 'https://unisportserver.onrender.com/lessons/all';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('백업 응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`Backup HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('백업 응답 데이터:', data);
      
      if (Array.isArray(data)) {
        return data;
      } else {
        throw new Error('백업 응답이 배열 형태가 아닙니다');
      }
    } catch (error) {
      console.error('getLessonsBackup 오류:', error);
      throw error;
    }
  }

  // 날짜별 레슨 검색
  static async getLessonsByDate(date: string): Promise<BackendLesson[]> {
    try {
      console.log('날짜별 레슨 검색 시작:', date);
      const url = `https://unisportserver.onrender.com/lessons/by-date?date=${date}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('날짜별 검색 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('날짜별 검색 HTTP 오류:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('날짜별 검색 응답 데이터:', data);
      
      if (Array.isArray(data)) {
        console.log('날짜별 검색 결과 개수:', data.length);
        return data;
      } else {
        throw new Error('날짜별 검색 응답이 배열 형태가 아닙니다');
      }
    } catch (error) {
      console.error('날짜별 레슨 검색 오류:', error);
      throw error;
    }
  }

  // 수업 상세 정보 조회 (GET /lessons/{id})
  static async getLessonDetail(lessonId: number): Promise<BackendLessonDetail> {
    try {
      console.log('수업 상세 정보 조회 시작:', lessonId);
      const url = `https://unisportserver.onrender.com/lessons/${lessonId}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('수업 상세 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('수업 상세 HTTP 오류:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('수업 상세 응답 데이터:', data);
      
      return data;
    } catch (error) {
      console.error('수업 상세 정보 조회 오류:', error);
      throw error;
    }
  }

  // 리뷰 조회 (추천순 정렬) - GET /review/rating/{lessonId}
  static async getReviewsByRating(lessonId: number): Promise<BackendReviewResponse> {
    try {
      console.log('추천순 리뷰 조회 시작:', lessonId);
      const url = `https://unisportserver.onrender.com/review/rating/${lessonId}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('추천순 리뷰 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('추천순 리뷰 HTTP 오류:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('추천순 리뷰 응답 데이터:', data);
      
      return data;
    } catch (error) {
      console.error('추천순 리뷰 조회 오류:', error);
      throw error;
    }
  }

  // 리뷰 조회 (최신순 정렬) - GET /review/latest/{lessonId}
  static async getReviewsByLatest(lessonId: number): Promise<BackendReviewResponse> {
    try {
      console.log('최신순 리뷰 조회 시작:', lessonId);
      const url = `https://unisportserver.onrender.com/review/latest/${lessonId}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('최신순 리뷰 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('최신순 리뷰 HTTP 오류:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('최신순 리뷰 응답 데이터:', data);
      
      return data;
    } catch (error) {
      console.error('최신순 리뷰 조회 오류:', error);
      throw error;
    }
  }

  // 스포츠별 수업 검색 - GET /lessons/by-sport/{sport}
  static async getLessonsBySportName(sport: string): Promise<BackendLesson[]> {
    try {
      console.log('스포츠별 수업 검색 시작:', sport);
      const encodedSport = encodeURIComponent(sport);
      const url = `https://unisportserver.onrender.com/lessons/by-sport/${encodedSport}`;
      console.log('요청 URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      console.log('스포츠별 검색 응답 상태:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('스포츠별 검색 HTTP 오류:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('스포츠별 검색 응답 데이터:', data);
      
      if (Array.isArray(data)) {
        console.log('스포츠별 검색 결과 개수:', data.length);
        return data;
      } else {
        throw new Error('스포츠별 검색 응답이 배열 형태가 아닙니다');
      }
    } catch (error) {
      console.error('스포츠별 수업 검색 오류:', error);
      throw error;
    }
  }
}
