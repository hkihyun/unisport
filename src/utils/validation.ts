// 이메일 검증
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 검증 (최소 8자, 영문/숫자/특수문자 조합)
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// 전화번호 검증 (한국 전화번호 형식)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

// 이름 검증 (한글 2-10자)
export const validateName = (name: string): boolean => {
  const nameRegex = /^[가-힣]{2,10}$/;
  return nameRegex.test(name);
};

// 대학교 이름 검증
export const validateUniversity = (university: string): boolean => {
  return university.length >= 2 && university.length <= 50;
};

// 가격 검증 (0보다 큰 정수)
export const validatePrice = (price: number): boolean => {
  return price > 0 && Number.isInteger(price);
};

// 수업 제목 검증
export const validateLessonTitle = (title: string): boolean => {
  return title.length >= 2 && title.length <= 100;
};

// 수업 설명 검증
export const validateLessonDescription = (description: string): boolean => {
  return description.length >= 10 && description.length <= 1000;
};

// 날짜 검증 (미래 날짜인지 확인)
export const validateFutureDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate > today;
};

// 시간 검증 (HH:MM 형식)
export const validateTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// 검증 결과 타입
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// 통합 검증 함수들
export const validateEmailWithMessage = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, message: '올바른 이메일 형식이 아닙니다.' };
  }
  return { isValid: true };
};

export const validatePasswordWithMessage = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: '비밀번호를 입력해주세요.' };
  }
  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  if (!validatePassword(password)) {
    return { isValid: false, message: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.' };
  }
  return { isValid: true };
};

export const validateNameWithMessage = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: '이름을 입력해주세요.' };
  }
  if (!validateName(name)) {
    return { isValid: false, message: '이름은 한글 2-10자로 입력해주세요.' };
  }
  return { isValid: true };
};

export const validateUniversityWithMessage = (university: string): ValidationResult => {
  if (!university) {
    return { isValid: false, message: '대학교를 입력해주세요.' };
  }
  if (!validateUniversity(university)) {
    return { isValid: false, message: '올바른 대학교명을 입력해주세요.' };
  }
  return { isValid: true };
};
