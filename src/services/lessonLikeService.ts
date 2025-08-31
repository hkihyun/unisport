import { apiClient } from './api';
import { BackendLessonDetail } from '../types';

export interface LessonLikeResponse {
  message: string;
  status: string;
}

// 백엔드 API 응답 형식에 맞게 수정
export type FavoriteLesson = BackendLessonDetail;

export const lessonLikeService = {
  // 관심 레슨 등록
  addToFavorites: async (lessonId: number, userId: number): Promise<LessonLikeResponse> => {
    try {
      const response = await apiClient.post<LessonLikeResponse>(`/lessonLike/${lessonId}?userId=${userId}`, {});
      if (!response.success) {
        throw new Error(response.error || '관심 레슨 등록에 실패했습니다.');
      }
      return response.data as LessonLikeResponse;
    } catch (error: any) {
      if (error.message?.includes('400')) {
        throw new Error('이미 관심 레슨으로 등록되어 있습니다.');
      }
      throw new Error('관심 레슨 등록에 실패했습니다.');
    }
  },

  // 관심 레슨 목록 조회 - 백엔드 API 엔드포인트 사용
  getFavoriteLessons: async (userId: number): Promise<FavoriteLesson[]> => {
    try {
      const response = await apiClient.get<FavoriteLesson[]>(`/lessonLike/user-like-lesson/${userId}`);
      
      if (!response.success) {
        throw new Error(response.error || '관심 레슨 목록을 가져오는데 실패했습니다.');
      }
      
      return response.data as FavoriteLesson[];
    } catch (error: any) {
      console.error('관심 레슨 목록 조회 실패:', error);
      throw new Error('관심 레슨 목록을 가져오는데 실패했습니다.');
    }
  },

  // 관심 레슨 제거
  removeFromFavorites: async (lessonId: number, userId: number): Promise<LessonLikeResponse> => {
    try {
      console.log('API 호출 시작 - removeFromFavorites:', { lessonId, userId });
      const response = await apiClient.delete<LessonLikeResponse>(`/lessonLike/${lessonId}?userId=${userId}`);
      console.log('API 응답:', response);
      
      if (!response.success) {
        console.error('API 응답 실패:', response.error);
        throw new Error(response.error || '관심 레슨 제거에 실패했습니다.');
      }
      
      // 백엔드에서 NOT_FOUND를 반환하는 경우 처리
      if (response.data === 'NOT_FOUND') {
        console.log('관심 레슨이 이미 제거되었거나 존재하지 않음');
        // NOT_FOUND는 성공으로 처리 (이미 제거된 상태)
        return { message: '관심 레슨이 이미 제거되었습니다.', status: 'REMOVED' };
      }
      
      console.log('API 호출 성공:', response.data);
      return response.data as LessonLikeResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('관심 레슨 제거에 실패했습니다.');
    }
  }
};
