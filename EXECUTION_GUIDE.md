# 🚀 UniSportCard 실행 가이드

## 📱 빠른 실행 방법 (추천)

### 방법 1: Expo Snack (가장 간단)
1. [Expo Snack](https://snack.expo.dev/) 접속
2. 프로젝트 코드 복사하여 붙여넣기
3. QR코드로 스마트폰에서 실행

### 방법 2: 웹 버전 (브라우저)
```bash
# 프로젝트 폴더로 이동
cd newuni

# 의존성 설치
npm install

# 웹 버전 실행
npx expo start --web
```

### 방법 3: 모바일 앱 (Expo Go)
1. 스마트폰에 "Expo Go" 앱 설치
2. 프로젝트 폴더에서 `npx expo start` 실행
3. QR코드로 스마트폰에서 실행

## 🔧 상세 설치 및 실행

### 1. 사전 요구사항
- **Node.js** (v16 이상)
- **npm** 또는 **yarn**
- **Git**

### 2. 프로젝트 클론
```bash
# 프로젝트 다운로드
git clone [프로젝트_URL]
cd newuni

# 또는 압축 파일 해제 후 폴더로 이동
cd newuni
```

### 3. 의존성 설치
```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

### 4. 앱 실행
```bash
# Expo 개발 서버 시작
npx expo start

# 또는
npm start
```

### 5. 플랫폼 선택
- **웹**: `w` 키 누르기
- **안드로이드**: `a` 키 누르기 (Android Studio 필요)
- **iOS**: `i` 키 누르기 (Xcode 필요, Mac만 가능)

## 📱 모바일에서 테스트

### Android
1. **Expo Go** 앱 설치 (Google Play Store)
2. QR코드 스캔
3. 앱 자동 다운로드 및 실행

### iOS
1. **Expo Go** 앱 설치 (App Store)
2. 카메라로 QR코드 스캔
3. 앱 자동 다운로드 및 실행

## 🎮 데모 시나리오

### 기본 사용자 플로우
1. **앱 실행** → 홈 화면 표시
2. **로그인** → 임시 로그인 버튼 클릭
3. **홈 화면 탐색** → 추천 수업 확인
4. **수업 목록** → 다양한 종목 확인
5. **프로필** → 사용자 정보 확인

### 강사 기능 테스트
1. **수업 개설** → 종목 선택 메뉴 확인
2. **종목 선택** → 50+ 종목 중 선택
3. **수업 정보 입력** → 제목, 설명, 난이도 설정
4. **일정 설정** → 요일 및 시간 선택

## 🔍 주요 기능 체크리스트

### ✅ 기본 기능
- [ ] 앱 실행 및 로딩
- [ ] 홈 화면 표시
- [ ] 탭 네비게이션 작동
- [ ] 로그인/로그아웃

### ✅ 수업 관련
- [ ] 수업 목록 표시
- [ ] 종목별 필터링
- [ ] 수업 상세 정보
- [ ] 수업 개설 폼

### ✅ 사용자 관리
- [ ] 프로필 화면
- [ ] 설정 화면
- [ ] 찜한 수업 관리

## 🐛 문제 해결

### 일반적인 오류

#### 1. "Metro bundler" 오류
```bash
# Metro 캐시 클리어
npx expo start --clear
```

#### 2. 의존성 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
```

#### 3. 포트 충돌
```bash
# 다른 포트 사용
npx expo start --port 8081
```

#### 4. Expo Go 연결 실패
- 같은 Wi-Fi 네트워크 사용 확인
- 방화벽 설정 확인
- `npx expo start --tunnel` 사용

### 개발 환경별 문제

#### Windows
- **PowerShell 실행 정책**: `Set-ExecutionPolicy RemoteSigned`
- **안드로이드 스튜디오**: 환경 변수 설정 확인

#### macOS
- **Xcode**: 최신 버전 설치 및 라이선스 동의
- **iOS 시뮬레이터**: Xcode > Preferences > Components

#### Linux
- **안드로이드 스튜디오**: Java 8 이상 설치
- **환경 변수**: ANDROID_HOME, JAVA_HOME 설정

## 📊 성능 최적화

### 개발 모드
```bash
# 개발 모드로 실행
npx expo start --dev-client
```

### 프로덕션 빌드
```bash
# 웹 빌드
npx expo export:web

# 안드로이드 APK
npx expo build:android -t apk
```

## 🎯 대회 제출 시 주의사항

### 1. **실행 환경 명시**
- 지원 플랫폼: iOS, Android, Web
- 최소 요구사항: Node.js 16+, Expo Go 앱

### 2. **데모 시나리오 준비**
- 핵심 기능 위주로 3-5분 데모
- 사용자 플로우와 강사 플로우 모두 시연

### 3. **기술적 특징 강조**
- TypeScript 사용으로 타입 안정성
- 컴포넌트 기반 재사용 가능한 구조
- 크로스 플랫폼 지원

### 4. **문서 준비**
- README.md (프로젝트 개요)
- PROJECT_INTRODUCTION.md (상세 소개)
- EXECUTION_GUIDE.md (실행 방법)

## 📞 지원 및 문의

### 기술적 문제
- **GitHub Issues**: 프로젝트 저장소에 이슈 등록
- **Expo 문서**: [docs.expo.dev](https://docs.expo.dev)

### 대회 관련
- **프로젝트 소개서**: PROJECT_INTRODUCTION.md 참조
- **실행 가이드**: 이 문서 참조

---

**UniSportCard**를 성공적으로 실행하여 대회에서 좋은 성과를 거두시기 바랍니다! 🚀

모든 기능이 정상적으로 작동하는지 미리 테스트해보시고, 문제가 발생하면 위의 문제 해결 가이드를 참조하세요.
