import React, { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { AuthService, LoginRequest, RegisterRequest } from '../services/authService';

// 인증 상태 타입
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isJustLoggedIn: boolean; // 로그인 직후 상태 추가
}

// 인증 컨텍스트 액션 타입
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

export interface UseAuthReturn extends AuthState, AuthActions {}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    isJustLoggedIn: false, // 초기값 설정
  });

  // 앱 시작 시 인증 상태 초기화
  const initializeAuth = async (): Promise<void> => {
    try {
      const [savedUser, savedToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('authToken')
      ]);

      // 저장된 토큰이 있고, 유효한 사용자 정보가 있는 경우에만 로그인 상태로 설정
      if (savedToken && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          // 토큰 유효성 검증 (실제 구현에서는 서버에 토큰 유효성 확인 요청)
          // 여기서는 간단히 저장된 정보가 있는지만 확인
          if (user && user.id) {
            setAuthState({
              user,
              token: savedToken,
              isAuthenticated: true,
              isLoading: false,
              isJustLoggedIn: false
            });
          } else {
            // 유효하지 않은 사용자 정보인 경우 로그아웃 상태로 설정
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              isJustLoggedIn: false
            });
          }
        } catch (error) {
          console.error('저장된 사용자 정보 파싱 실패:', error);
          // 파싱 실패 시 로그아웃 상태로 설정
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isJustLoggedIn: false
          });
        }
      } else {
        // 저장된 정보가 없으면 로그아웃 상태로 설정
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isJustLoggedIn: false
        });
      }
    } catch (error) {
      console.error('인증 상태 초기화 실패:', error);
      // 에러 발생 시 로그아웃 상태로 설정
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isJustLoggedIn: false
      });
    }
  };

  // isJustLoggedIn 상태를 자동으로 false로 설정하는 useEffect
  useEffect(() => {
    if (authState.isJustLoggedIn) {
      const timer = setTimeout(() => {
        setAuthState(prev => ({ ...prev, isJustLoggedIn: false }));
      }, 1000); // 1초 후 자동으로 false로 설정
      
      return () => clearTimeout(timer);
    }
  }, [authState.isJustLoggedIn]);

  useEffect(() => {
    initializeAuth();
  }, []);

  // isJustLoggedIn 상태를 3초 후에 false로 초기화
  useEffect(() => {
    if (authState.isJustLoggedIn) {
      const timer = setTimeout(() => {
        setAuthState(prev => ({ ...prev, isJustLoggedIn: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authState.isJustLoggedIn]);


  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await AuthService.login(credentials);
      if (response.success && response.data) {
        // API 응답에서 User 타입으로 변환
        const user: User = {
          id: response.data.id.toString(),
          name: response.data.name,
          email: response.data.email,
          university: response.data.university,
          studentNumber: response.data.studentNumber, // 학번 필드 추가
          major: '',
          grade: 0,
          bio: '',
          rating: 0,
          reviewCount: 0,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        
        // 토큰이 없으므로 임시 토큰 생성
        const tempToken = `temp_${Date.now()}`;
        
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('authToken', tempToken);
        
        setAuthState({
          user,
          token: tempToken,
          isAuthenticated: true,
          isLoading: false,
          isJustLoggedIn: true // 로그인 직후 상태 설정
        });
        return true;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await AuthService.register(userData);
      if (response.success && response.data) {
        // RegisterResponse를 User 타입으로 변환
        const user: User = {
          id: response.data.id.toString(),
          name: response.data.name,
          email: response.data.email,
          university: response.data.university,
          studentNumber: response.data.studentNumber, // 학번 필드 추가
          major: '',
          grade: 0,
          bio: '',
          rating: 0,
          reviewCount: 0,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        };
        // 회원가입 후에는 토큰이 없으므로 로그인 상태가 아님
        await AsyncStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({
          user,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          isJustLoggedIn: false // 회원가입 후에는 로그인 상태가 아님
        });
        return true;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // AsyncStorage에서 사용자 정보와 토큰 완전히 제거
      await Promise.all([
        AsyncStorage.removeItem('user'),
        AsyncStorage.removeItem('authToken')
      ]);
      
      // 상태를 로그아웃 상태로 초기화
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isJustLoggedIn: false
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 상태는 로그아웃으로 설정
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isJustLoggedIn: false
      });
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await AuthService.updateProfile(userData);
      if (response.success && response.data) {
        const updatedUser = response.data;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isJustLoggedIn: false // 프로필 업데이트 시에는 로그인 직후 상태가 아님
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await AuthService.getProfile();
      if (response.success && response.data) {
        const updatedUser = response.data;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isJustLoggedIn: false // 사용자 정보 새로고침 시에는 로그인 직후 상태가 아님
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: UseAuthReturn = {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
