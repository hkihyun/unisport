export interface InstructorVerificationRequest {
  studentNumber: string;
  photo: any; // FormData에 추가될 파일 객체
}

export interface InstructorVerificationResponse {
  success: boolean;
  message: string;
}

export interface InstructorStatusResponse {
  success: boolean;
  isVerified: boolean;
  message?: string;
}

// 사용자 강사 상태 응답 타입 추가
export interface UserInstructorStatusResponse {
  success: boolean;
  isInstructor: boolean;
  message?: string;
}

export class InstructorService {
  private static readonly BASE_URL = 'https://unisportserver.onrender.com';

  /**
   * 강사 인증 상태 확인
   * @param userId 사용자 ID
   * @returns 인증 상태
   */
  static async checkInstructorStatus(userId: number): Promise<InstructorStatusResponse> {
    try {
      console.log('🔍 강사 인증 상태 확인 API 호출:', `${this.BASE_URL}/users/${userId}/instructor-status`);
      
      const response = await fetch(
        `${this.BASE_URL}/users/${userId}/instructor-status`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      console.log('📡 API 응답 상태:', response.status, response.statusText);
      console.log('📡 API 응답 헤더:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('📡 API 응답 데이터:', data);
        console.log('📡 data.isVerified 값:', data.isVerified);
        console.log('📡 data 타입:', typeof data);
        
        return {
          success: true,
          isVerified: data.isVerified || false,
          message: data.message
        };
      } else {
        console.log('❌ API 응답 실패:', response.status);
        const errorText = await response.text();
        console.log('❌ 에러 응답 내용:', errorText);
        
        return {
          success: false,
          isVerified: false,
          message: '강사 인증 상태를 확인할 수 없습니다.'
        };
      }
    } catch (error) {
      console.error('🚨 강사 인증 상태 확인 에러:', error);
      return {
        success: false,
        isVerified: false,
        message: '네트워크 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 사용자의 강사 여부 확인 (DB의 isInstructor 값)
   * @param userId 사용자 ID
   * @returns 강사 여부
   */
  static async checkUserInstructorStatus(userId: number): Promise<UserInstructorStatusResponse> {
    try {
      console.log('🔍 사용자 강사 상태 확인 API 호출:', `${this.BASE_URL}/users/${userId}`);
      
      const response = await fetch(
        `${this.BASE_URL}/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      console.log('📡 사용자 정보 API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const userData = await response.json();
        console.log('📡 사용자 정보 API 응답 데이터:', userData);
        console.log('📡 isInstructor 값:', userData.isInstructor);
        
        return {
          success: true,
          isInstructor: userData.isInstructor || false,
          message: '사용자 강사 상태를 확인했습니다.'
        };
      } else {
        console.log('❌ 사용자 정보 API 응답 실패:', response.status);
        const errorText = await response.text();
        console.log('❌ 에러 응답 내용:', errorText);
        
        return {
          success: false,
          isInstructor: false,
          message: '사용자 정보를 확인할 수 없습니다.'
        };
      }
    } catch (error) {
      console.error('🚨 사용자 강사 상태 확인 에러:', error);
      return {
        success: false,
        isInstructor: false,
        message: '네트워크 오류가 발생했습니다.'
      };
    }
  }

  /**
   * 강사 인증 요청
   * @param userId 사용자 ID
   * @param data 강사 인증 데이터 (학번, 사진)
   * @returns 인증 결과
   */
  static async verifyInstructor(
    userId: number,
    data: InstructorVerificationRequest
  ): Promise<InstructorVerificationResponse> {
    try {
      console.log('🔍 강사 인증 API 호출 시작:', userId);
      console.log('📤 요청 데이터:', { studentNumber: data.studentNumber, photo: data.photo });
      
      // FormData 생성
      const formData = new FormData();
      formData.append('studentNumber', data.studentNumber);
      formData.append('photo', data.photo);

      console.log('📡 강사 인증 API 호출:', `${this.BASE_URL}/users/instructor-verification/${userId}`);

      const response = await fetch(
        `${this.BASE_URL}/users/instructor-verification/${userId}`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': '*/*',
          },
        }
      );

      console.log('📡 강사 인증 API 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const message = await response.text();
        console.log('✅ 강사 인증 성공:', message);
        return {
          success: true,
          message: message || '강사 인증이 완료되었습니다.',
        };
      } else {
        const errorText = await response.text();
        console.log('❌ 강사 인증 실패:', response.status, errorText);
        return {
          success: false,
          message: `강사 인증에 실패했습니다. (${response.status}: ${errorText})`,
        };
      }
    } catch (error) {
      console.error('🚨 강사 인증 API 에러:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
      };
    }
  } 
}
