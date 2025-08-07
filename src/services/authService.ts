import { apiClient, API_ENDPOINTS } from './api';
import { User, ApiResponse } from '../types';

// 로그인 요청 데이터
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청 데이터
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  university: string;
  major?: string;
  grade?: number;
  bio?: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// 인증 서비스 클래스
export class AuthService {
  // 로그인
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  // 회원가입
  static async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  // 로그아웃
  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT, {}, true);
  }

  // 토큰 갱신
  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  }

  // 프로필 조회
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE, true);
  }

  // 프로필 업데이트
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(API_ENDPOINTS.AUTH.PROFILE, userData, true);
  }
}
