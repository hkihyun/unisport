import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types';

// API 기본 설정
const API_BASE_URL = 'https://unisportserver.onrender.com';

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 요청 옵션
interface ApiRequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

// API 클라이언트 클래스
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 토큰 가져오기
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // 기본 헤더 설정
  private async getHeaders(requiresAuth: boolean = false): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // API 요청 실행
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.getHeaders(options.requiresAuth);

      const requestOptions: RequestInit = {
        method: options.method,
        headers,
      };

      if (options.body) {
        requestOptions.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  // POST 요청
  async post<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
  }

  // PUT 요청
  async put<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }

  // PATCH 요청
  async patch<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/login',
    // 아래 엔드포인트는 Swagger 스펙에 없으므로 추후 서버 추가 시 활성화
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // 사용자 관련
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  
  // 스포츠 관련
  SPORTS: {
    BASE: '/sports',
    CATEGORIES: '/sports/categories',
  },
  
  // 수업 관련
  LESSONS: {
    BASE: '/lessons',
    CREATE: '/lessons',
    SEARCH: '/lessons/search',
    BY_INSTRUCTOR: '/lessons/instructor',
    BY_SPORT: '/lessons/sport',
  },
  
  // 예약 관련
  BOOKINGS: {
    BASE: '/bookings',
    CREATE: '/bookings',
    BY_USER: '/bookings/user',
    BY_LESSON: '/bookings/lesson',
  },
  
  // 리뷰 관련
  REVIEWS: {
    BASE: '/reviews',
    BY_LESSON: '/reviews/lesson',
    BY_INSTRUCTOR: '/reviews/instructor',
  },
  
  // 스케줄 관련
  SCHEDULES: {
    BASE: '/schedules',
    BY_LESSON: '/schedules/lesson',
  },
} as const;
