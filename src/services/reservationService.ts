import { apiClient, API_ENDPOINTS } from './api';
import { BackendReservationResponse, CreateReservationRequest, CreateReservationResponse } from '../types';

// 디버깅을 위한 로그 추가
console.log('API_ENDPOINTS in ReservationService:', API_ENDPOINTS);
console.log('RESERVATIONS:', API_ENDPOINTS?.RESERVATIONS);

export class ReservationService {
  // 사용자의 예약 목록 조회
  static async getUserReservations(userId: number): Promise<BackendReservationResponse> {
    try {
      const response = await apiClient.get<BackendReservationResponse>(
        `${API_ENDPOINTS.RESERVATIONS.BY_USER}/${userId}`,
        false // 인증이 필요하지 않음
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        console.warn('예약 조회 실패:', response.error);
        // 에러 발생 시 빈 응답 구조 반환
        return {
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            paged: false,
            unpaged: true
          },
          totalElements: 0,
          totalPages: 0,
          last: true,
          size: 10,
          number: 0,
          sort: { empty: true, sorted: false, unsorted: true },
          numberOfElements: 0,
          first: true,
          empty: true
        };
      }
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      // 에러 발생 시 빈 응답 구조 반환
      return {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: false,
          unpaged: true
        },
        totalElements: 0,
        totalPages: 0,
        last: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        first: true,
        empty: true
      };
    }
  }

  // 특정 날짜 예약 조회
  static async getReservationsByDate(userId: number, date: string): Promise<BackendReservationResponse> {
    try {
      const response = await apiClient.get<BackendReservationResponse>(
        `${API_ENDPOINTS.RESERVATIONS.BY_USER}/${userId}/${date}`,
        false // 인증이 필요하지 않음
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        console.warn('날짜별 예약 조회 실패:', response.error);
        // 에러 발생 시 빈 응답 구조 반환
        return {
          content: [],
          pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            paged: false,
            unpaged: true
          },
          totalElements: 0,
          totalPages: 0,
          last: true,
          size: 10,
          number: 0,
          sort: { empty: true, sorted: false, unsorted: true },
          numberOfElements: 0,
          first: true,
          empty: true
        };
      }
    } catch (error) {
      console.error('Error fetching reservations by date:', error);
      // 에러 발생 시 빈 응답 구조 반환
      return {
        content: [],
        pageable: {
          pageNumber: 0,
          pageSize: 10,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: false,
          unpaged: true
        },
        totalElements: 0,
        totalPages: 0,
        last: true,
        size: 10,
        number: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        numberOfElements: 0,
        first: true,
        empty: true
      };
    }
  }

  // 예약 생성
  static async createReservation(request: CreateReservationRequest): Promise<CreateReservationResponse> {
    try {
      console.log('Creating reservation with endpoint:', API_ENDPOINTS.RESERVATIONS.BASE);
      const response = await apiClient.post<CreateReservationResponse>(
        API_ENDPOINTS.RESERVATIONS.BASE,
        request,
        false // 인증이 필요하지 않음
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  // 예약 취소 (lessonId로)
  static async cancelReservation(lessonId: number): Promise<any> {
    try {
      console.log('Canceling reservation with lessonId:', lessonId);
      const response = await apiClient.delete<any>(
        `${API_ENDPOINTS.RESERVATIONS.BASE}?lessonId=${lessonId}`,
        false // 인증이 필요하지 않음
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }
}

export default ReservationService;
