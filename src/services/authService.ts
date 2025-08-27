import { apiClient, API_ENDPOINTS } from './api';
import { User, ApiResponse } from '../types';

// 로그인 요청 데이터
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 회원가입 요청 데이터
export interface RegisterRequest {
  loginId: string;
  password: string;
  name: string;
  email: string;
  university: string;
  studentNumber: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  id: number;
  loginId: string;
  password: string;
  name: string;
  email: string;
  university: string;
  studentNumber: string;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 응답 데이터
export interface RegisterResponse {
  id: number;
  loginId: string;
  password: string;
  name: string;
  email: string;
  university: string;
  studentNumber: string;
  createdAt: string;
  updatedAt: string;
}

// 강사 정보 응답 데이터
export interface InstructorResponse {
  id: number;
  loginId: string;
  name: string;
  email: string;
  university: string;
  studentNumber: string;
  createdAt: string;
  updatedAt: string;
}

// 인증 서비스 클래스
export class AuthService {
  // 로그인
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  }

  // 회원가입
  static async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
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

  // 강사 정보 조회 (강사 ID로)
  static async getInstructorInfo(instructorId: number): Promise<ApiResponse<InstructorResponse>> {
    return apiClient.get<InstructorResponse>(`/users/${instructorId}`, false);
  }
}
