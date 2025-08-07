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
}

// 인증 컨텍스트 액션 타입
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  tempLogin: () => void;
  tempLogout: () => void;
}

export interface UseAuthReturn extends AuthState, AuthActions {}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

// 토큰 저장
const saveToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
};

const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
};

const tempUser: User = {
  id: 'temp-user-1',
  name: '개발자',
  email: 'dev@example.com',
  university: '테스트 대학교',
  major: '컴퓨터공학과',
  grade: 3,
  bio: '개발 중인 사용자입니다.',
  rating: 4.5,
  reviewCount: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [token, userString] = await Promise.all([
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('user'),
        ]);
        if (token && userString) {
          const user = JSON.parse(userString) as User;
          setAuthState({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    loadAuthState();
  }, []);

  const tempLogin = () => {
    setAuthState({
      user: tempUser,
      token: 'temp-token',
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const tempLogout = () => {
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await AuthService.login(credentials);
      if (response.success && response.data) {
        const { user, token } = response.data;
        await Promise.all([
          saveToken(token),
          saveUser(user),
        ]);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
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
        const { user, token } = response.data;
        await Promise.all([
          saveToken(token),
          saveUser(user),
        ]);
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
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
      setAuthState(prev => ({ ...prev, isLoading: true }));
      if (authState.token) {
        await AuthService.logout();
      }
      await Promise.all([
        removeToken(),
        removeUser(),
      ]);
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const response = await AuthService.updateProfile(userData);
      if (response.success && response.data) {
        const updatedUser = response.data;
        await saveUser(updatedUser);
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
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
        const user = response.data;
        await saveUser(user);
        setAuthState(prev => ({
          ...prev,
          user,
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
    tempLogin,
    tempLogout,
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
