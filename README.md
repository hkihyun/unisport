# UniSportCard

대학생들끼리 스포츠를 배우고 가르치는 중개 플랫폼 모바일 앱입니다.

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── screens/            # 화면 컴포넌트
├── services/           # API 서비스 레이어
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── hooks/              # 커스텀 훅
├── constants/          # 상수 정의
└── navigation/         # 네비게이션 설정
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 16.0 이상
- npm 또는 yarn
- Expo CLI
- Android Studio (Android 개발용)
- Xcode (iOS 개발용, macOS 필요)

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 시작**
   ```bash
   npm start
   ```

3. **플랫폼별 실행**
   ```bash
   # Android
   npm run android
   
   # iOS (macOS 필요)
   npm run ios
   
   # 웹
   npm run web
   ```

## 📱 주요 기능

### 사용자 기능
- 회원가입/로그인
- 프로필 관리
- 수업 검색 및 필터링
- 수업 예약
- 리뷰 작성 및 조회

### 강사 기능
- 수업 생성 및 관리
- 스케줄 관리
- 예약 현황 확인
- 수익 관리

## 🛠️ 기술 스택

- **프레임워크**: React Native (Expo)
- **언어**: TypeScript
- **네비게이션**: React Navigation
- **상태 관리**: React Hooks
- **스토리지**: AsyncStorage
- **API 통신**: Fetch API

## 🔧 개발 가이드

### API 연동

1. **API 엔드포인트 설정**
   - `src/services/api.ts`에서 `API_BASE_URL` 수정
   - 팀원이 제공하는 API 도메인으로 변경

2. **서비스 레이어**
   - `src/services/` 폴더에 각 기능별 서비스 파일 생성
   - API 호출 로직은 서비스 레이어에서 관리

### 컴포넌트 개발

1. **새 컴포넌트 생성**
   ```typescript
   // src/components/MyComponent.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { COLORS } from '../constants/colors';

   interface MyComponentProps {
     title: string;
   }

   export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
     return (
       <View style={styles.container}>
         <Text style={styles.text}>{title}</Text>
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       padding: 16,
       backgroundColor: COLORS.WHITE,
     },
     text: {
       fontSize: 16,
       color: COLORS.TEXT_PRIMARY,
     },
   });
   ```

2. **화면 컴포넌트 생성**
   ```typescript
   // src/screens/MyScreen.tsx
   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { SafeAreaView } from 'react-native-safe-area-context';
   import { COLORS } from '../constants/colors';

   export const MyScreen: React.FC = () => {
     return (
       <SafeAreaView style={styles.container}>
         <Text style={styles.title}>화면 제목</Text>
       </SafeAreaView>
     );
   };

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: COLORS.BACKGROUND,
     },
     title: {
       fontSize: 24,
       fontWeight: 'bold',
       color: COLORS.TEXT_PRIMARY,
       textAlign: 'center',
       marginTop: 20,
     },
   });
   ```

### 네비게이션

1. **새 화면 추가**
   - `src/constants/screens.ts`에 화면 이름 추가
   - `src/navigation/AppNavigator.tsx`에 라우트 추가

2. **화면 간 이동**
   ```typescript
   import { useNavigation } from '@react-navigation/native';
   import { SCREENS } from '../constants/screens';

   const navigation = useNavigation();
   
   // 화면 이동
   navigation.navigate(SCREENS.LESSON_DETAIL, { lessonId: '123' });
   ```

### 상태 관리

1. **커스텀 훅 사용**
   ```typescript
   import { useAuth } from '../hooks/useAuth';

   const { user, login, logout } = useAuth();
   ```

2. **로컬 상태 관리**
   ```typescript
   const [data, setData] = useState<DataType[]>([]);
   const [loading, setLoading] = useState(false);
   ```

## 🎨 디자인 시스템

### 색상
- `src/constants/colors.ts`에서 색상 정의
- 일관된 색상 사용을 위해 `COLORS` 객체 활용

### 스타일링
- StyleSheet 사용
- 재사용 가능한 스타일 컴포넌트 생성
- 반응형 디자인 고려

## 📋 개발 체크리스트

### 프론트엔드 개발자
- [ ] API 엔드포인트 확인 및 연동
- [ ] 화면별 컴포넌트 구현
- [ ] 네비게이션 구조 설정
- [ ] 폼 검증 로직 구현
- [ ] 에러 처리 및 로딩 상태 관리
- [ ] 반응형 디자인 적용

### API 연동
- [ ] 인증 API 연동
- [ ] 사용자 관리 API 연동
- [ ] 수업 관련 API 연동
- [ ] 예약 관련 API 연동
- [ ] 리뷰 관련 API 연동

## 🐛 문제 해결

### 일반적인 문제들

1. **Metro 번들러 오류**
   ```bash
   npx expo start --clear
   ```

2. **의존성 충돌**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **캐시 문제**
   ```bash
   npx expo start --clear
   ```

## 📞 팀 협업

### API 개발자와의 협업
- API 문서 공유
- 엔드포인트 테스트
- 데이터 형식 확인
- 에러 응답 형식 통일

### 디자이너와의 협업
- 피그마 디자인 확인
- 컴포넌트 구조 논의
- 반응형 디자인 요구사항 확인

## 📝 주의사항

1. **타입 안정성**
   - TypeScript 타입 정의 철저히 하기
   - API 응답 타입 정의
   - 컴포넌트 Props 타입 정의

2. **성능 최적화**
   - 불필요한 리렌더링 방지
   - 이미지 최적화
   - 메모리 누수 방지

3. **사용자 경험**
   - 로딩 상태 표시
   - 에러 메시지 명확히
   - 접근성 고려

## 📄 라이선스

이 프로젝트는 팀 프로젝트입니다.
