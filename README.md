# UniSportCard - 대학생 스포츠 중개 플랫폼

대학생들끼리 스포츠를 배우고 가르치는 중개 플랫폼 모바일 앱입니다.

## 🚀 프로젝트 개요

- **프론트엔드**: React Native (Expo) + TypeScript
- **백엔드**: API 서버 필요 (아직 미구현)
- **주요 기능**: 수업 등록, 검색, 예약, 리뷰 시스템

## 📱 앱 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
├── screens/            # 화면 컴포넌트
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/         # 네비게이션 설정
├── services/          # API 서비스 레이어
│   ├── api.ts         # 기본 API 클라이언트
│   ├── authService.ts # 인증 관련 API
│   └── lessonService.ts # 수업 관련 API
├── hooks/             # 커스텀 훅
│   └── useAuth.ts     # 인증 상태 관리
├── types/             # TypeScript 타입 정의
├── constants/         # 상수 정의
└── utils/             # 유틸리티 함수
```

## 🔌 API 명세

### Base URL
```
https://your-api-domain.com/api
```

### 인증 (Authentication)

#### 1. 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "name": "김철수",
      "email": "user@example.com",
      "university": "서울대학교",
      "major": "컴퓨터공학과",
      "grade": 3,
      "bio": "안녕하세요!",
      "rating": 4.5,
      "reviewCount": 10,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-here",
    "refreshToken": "refresh-token-here"
  }
}
```

#### 2. 회원가입
```http
POST /auth/register
Content-Type: application/json

{
  "name": "김철수",
  "email": "user@example.com",
  "password": "password123",
  "university": "서울대학교",
  "major": "컴퓨터공학과",
  "grade": 3,
  "bio": "안녕하세요!"
}
```

#### 3. 로그아웃
```http
POST /auth/logout
Authorization: Bearer {token}
```

#### 4. 토큰 갱신
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

#### 5. 프로필 조회
```http
GET /auth/profile
Authorization: Bearer {token}
```

#### 6. 프로필 수정
```http
PUT /auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "김철수",
  "bio": "수정된 자기소개"
}
```

### 수업 (Lessons)

#### 1. 수업 목록 조회
```http
GET /lessons?page=1&limit=10&sport=tennis&price_min=10000&price_max=50000
```

**응답:**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "id": "lesson-123",
        "title": "테니스 기초 레슨",
        "description": "테니스 기초를 배워보세요",
        "sport": "tennis",
        "instructor": {
          "id": "user-123",
          "name": "김철수",
          "rating": 4.5,
          "reviewCount": 10
        },
        "price": 30000,
        "duration": 60,
        "maxStudents": 4,
        "location": "서울대학교 테니스장",
        "schedule": [
          {
            "id": "schedule-123",
            "date": "2024-01-15",
            "startTime": "14:00",
            "endTime": "15:00",
            "availableSpots": 3
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

#### 2. 수업 검색
```http
POST /lessons/search
Content-Type: application/json

{
  "sport": "tennis",
  "priceRange": {
    "min": 10000,
    "max": 50000
  },
  "location": "서울대학교",
  "date": "2024-01-15",
  "page": 1,
  "limit": 10
}
```

#### 3. 수업 상세 조회
```http
GET /lessons/{lessonId}
```

#### 4. 수업 생성
```http
POST /lessons
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "테니스 기초 레슨",
  "description": "테니스 기초를 배워보세요",
  "sport": "tennis",
  "price": 30000,
  "duration": 60,
  "maxStudents": 4,
  "location": "서울대학교 테니스장",
  "schedule": [
    {
      "date": "2024-01-15",
      "startTime": "14:00",
      "endTime": "15:00"
    }
  ]
}
```

#### 5. 수업 수정
```http
PUT /lessons/{lessonId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "수정된 제목",
  "price": 35000
}
```

#### 6. 수업 삭제
```http
DELETE /lessons/{lessonId}
Authorization: Bearer {token}
```

### 예약 (Bookings)

#### 1. 예약 생성
```http
POST /bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "lessonId": "lesson-123",
  "scheduleId": "schedule-123"
}
```

#### 2. 예약 목록 조회
```http
GET /bookings?page=1&limit=10
Authorization: Bearer {token}
```

#### 3. 예약 취소
```http
DELETE /bookings/{bookingId}
Authorization: Bearer {token}
```

### 리뷰 (Reviews)

#### 1. 리뷰 작성
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "lessonId": "lesson-123",
  "rating": 5,
  "comment": "정말 좋은 수업이었습니다!"
}
```

#### 2. 리뷰 목록 조회
```http
GET /lessons/{lessonId}/reviews?page=1&limit=10
```

## 📊 데이터 모델

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  grade: number;
  bio: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  description: string;
  sport: string;
  instructor: User;
  price: number;
  duration: number;
  maxStudents: number;
  location: string;
  schedule: LessonSchedule[];
  createdAt: string;
  updatedAt: string;
}
```

### LessonSchedule
```typescript
interface LessonSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  availableSpots: number;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  lesson: Lesson;
  student: User;
  schedule: LessonSchedule;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}
```

### Review
```typescript
interface Review {
  id: string;
  lesson: Lesson;
  student: User;
  rating: number;
  comment: string;
  createdAt: string;
}
```

## 🔐 인증

- **JWT 토큰** 기반 인증
- **Authorization 헤더**에 `Bearer {token}` 형식으로 전송
- **토큰 만료 시** refresh token으로 갱신

## 📝 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "이메일 형식이 올바르지 않습니다.",
    "details": {
      "email": "올바른 이메일 형식을 입력해주세요."
    }
  }
}
```

## 🚀 개발 환경 설정

### 프론트엔드 실행
```bash
cd UniSportCard
npm install
npx expo start
```

### 환경 변수
```env
API_BASE_URL=https://your-api-domain.com/api
```

## 📱 현재 구현된 기능

- ✅ 로그인/회원가입 UI
- ✅ 임시 로그인 (개발용)
- ✅ 홈 화면
- ✅ 프로필 화면
- ✅ 탭 네비게이션
- ✅ 인증 상태 관리

## 🔄 백엔드 개발 우선순위

1. **인증 API** (로그인, 회원가입, 토큰 관리)
2. **사용자 관리 API** (프로필 조회/수정)
3. **수업 관리 API** (CRUD)
4. **예약 시스템 API**
5. **리뷰 시스템 API**

## 📞 연락처

- **프론트엔드 개발자**: [연락처 정보]
- **백엔드 개발자**: [연락처 정보]
- **디자이너**: [연락처 정보]

---

**백엔드 개발자분들, 위 API 명세를 참고하여 개발해주세요!** 🚀
