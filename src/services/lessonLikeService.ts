import { apiClient } from './api';

export interface LessonLikeResponse {
  message: string;
  status: string;
}

export interface FavoriteLesson {
  id: number;
  lessonId: number;
  userId: number;
  lesson: {
    id: number;
    title: string;
    lessonDate: string;
    lessonTime: string;
    location: string;
    description?: string;
    instructorId?: number;
    maxParticipants?: number;
    currentParticipants?: number;
  };
}

export interface FavoriteLessonsResponse {
  content: FavoriteLesson[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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

  // 관심 레슨 목록 조회 - 여러 가능한 엔드포인트 시도
  getFavoriteLessons: async (userId: number): Promise<FavoriteLessonsResponse> => {
    const possibleEndpoints = [
      `/lessonLike?userId=${userId}`,
      `/lessonLike/user/${userId}`,
      `/lessonLike/favorites/${userId}`,
      `/favorites?userId=${userId}`,
      `/user/${userId}/favorites`,
      `/user/${userId}/lessonLikes`
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`시도 중: ${endpoint}`);
        const response = await apiClient.get<FavoriteLessonsResponse>(endpoint);
        
        if (response.success) {
          console.log(`성공: ${endpoint}`);
          return response.data as FavoriteLessonsResponse;
        }
      } catch (error) {
        console.log(`실패: ${endpoint}`, error);
        continue;
      }
    }

    throw new Error('관심 레슨 목록을 가져올 수 있는 엔드포인트를 찾을 수 없습니다.');
  },

  // 관심 레슨 제거
  removeFromFavorites: async (lessonId: number, userId: number): Promise<LessonLikeResponse> => {
    try {
      const response = await apiClient.delete<LessonLikeResponse>(`/lessonLike/${lessonId}?userId=${userId}`);
      if (!response.success) {
        throw new Error(response.error || '관심 레슨 제거에 실패했습니다.');
      }
      return response.data as LessonLikeResponse;
    } catch (error: any) {
      console.error('API Error:', error);
      throw new Error('관심 레슨 제거에 실패했습니다.');
    }
  }
};
