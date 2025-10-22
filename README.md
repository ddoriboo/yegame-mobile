# 예겜 모바일 앱 (YeGame Mobile)

React Native (Expo) 기반 예측 플랫폼 모바일 앱입니다.

## 📱 프로젝트 소개

예겜은 사용자들이 다양한 이슈(정치, 스포츠, 경제, 코인, 테크 등)에 대해 예측하고 가상 화폐 "감"을 이용해 베팅할 수 있는 모바일 앱입니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js (v16 이상)
- npm 또는 yarn
- Expo Go 앱 (iOS/Android 테스트용)

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

### 실행

```bash
# Expo 개발 서버 시작
npm start

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행 (macOS만 가능)
npm run ios

# 웹에서 실행
npm run web
```

## 🏗️ 프로젝트 구조

```
yegame-mobile/
├── App.js                      # 앱 엔트리 포인트
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js     # 네비게이션 설정
│   ├── screens/
│   │   ├── LoginScreen.js      # 로그인/회원가입
│   │   ├── HomeScreen.js       # 홈 화면 (인기 이슈)
│   │   ├── IssuesScreen.js     # 전체 이슈 목록
│   │   ├── IssueDetailScreen.js # 이슈 상세 및 베팅
│   │   └── MyPageScreen.js     # 내 정보 및 베팅 내역
│   ├── components/             # 재사용 가능한 컴포넌트
│   ├── services/
│   │   └── api.js              # API 클라이언트
│   ├── contexts/
│   │   └── AuthContext.js      # 인증 Context
│   └── utils/
│       └── constants.js        # 상수 및 유틸리티 함수
├── assets/                     # 이미지, 폰트 등
└── package.json
```

## 🔧 백엔드 연동

이 앱은 Express.js 백엔드 API와 통신합니다.

### 백엔드 URL 설정

`src/services/api.js` 파일에서 백엔드 URL을 설정하세요:

```javascript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // 로컬 개발
  : 'https://your-railway-app.up.railway.app/api';  // 프로덕션
```

### 로컬 개발 시 주의사항

- Android 에뮬레이터: `http://10.0.2.2:3000/api`
- iOS 시뮬레이터: `http://localhost:3000/api`
- 실제 디바이스: 컴퓨터의 로컬 IP 주소 사용 (예: `http://192.168.1.100:3000/api`)

## 🎨 주요 기능

### 인증
- 회원가입 / 로그인
- JWT 토큰 기반 인증
- AsyncStorage를 통한 세션 관리

### 이슈 탐색
- 카테고리별 필터링
- 검색 기능
- 실시간 확률 표시

### 베팅
- Yes/No 선택
- 금액 입력
- 실시간 코인 업데이트

### 내 정보
- 보유 감 확인
- 베팅 내역 조회
- 로그아웃

## 📦 주요 라이브러리

- **React Native**: 크로스플랫폼 모바일 프레임워크
- **Expo**: React Native 개발 플랫폼
- **React Navigation**: 네비게이션
- **Axios**: HTTP 클라이언트
- **AsyncStorage**: 로컬 저장소

## 🚢 배포

### Expo Application Services (EAS)

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 로그인
eas login

# 빌드 설정
eas build:configure

# Android APK 빌드
eas build --platform android

# iOS 빌드 (Apple Developer 계정 필요)
eas build --platform ios
```

### 앱 스토어 배포

```bash
# Android - Google Play Store
eas submit --platform android

# iOS - Apple App Store
eas submit --platform ios
```

## 🔐 환경 변수

백엔드 API URL은 `src/services/api.js`에서 직접 설정합니다.

프로덕션 배포 시에는 환경 변수를 사용하는 것을 권장합니다:

```javascript
// app.config.js 생성
export default {
  expo: {
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};

// 코드에서 사용
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig.extra.apiUrl;
```

## 🐛 문제 해결

### "Network Error" 발생 시
- 백엔드 서버가 실행 중인지 확인
- API_BASE_URL이 올바른지 확인
- 방화벽 설정 확인

### Android 에뮬레이터에서 연결 안 됨
- `http://10.0.2.2:3000/api` 사용

### 실제 디바이스에서 연결 안 됨
- 컴퓨터와 디바이스가 같은 Wi-Fi에 연결되어 있는지 확인
- 컴퓨터의 로컬 IP 주소 사용

## 📝 라이센스

MIT

## 👥 기여

이슈 및 PR은 언제나 환영합니다!

---

**예겜** - 예측의 재미, 예감게임
