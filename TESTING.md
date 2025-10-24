# 📱 예겜 모바일 앱 테스트 가이드

백엔드와 모바일 앱이 모두 준비되었습니다! 이제 앱을 테스트해봅시다.

## ✅ 현재 상황

**백엔드 (Railway 배포 완료)**
- 🌐 URL: https://yegam.ai.kr
- ✅ Express API 서버 실행 중
- ✅ SQLite 데이터베이스 준비됨

**모바일 앱 (GitHub 업로드 완료)**
- 📱 저장소: https://github.com/ddoriboo/yegame-mobile
- ✅ 백엔드 API 연결 완료 (yegam.ai.kr)
- ⏳ 로컬 테스트 준비 완료

---

## 🚀 앱 테스트 시작하기

### 1단계: Expo Go 설치

스마트폰에 **Expo Go** 앱을 설치하세요:

**Android**
- Google Play Store에서 "Expo Go" 검색 및 설치
- https://play.google.com/store/apps/details?id=host.exp.exponent

**iOS**
- App Store에서 "Expo Go" 검색 및 설치
- https://apps.apple.com/app/expo-go/id982107779

### 2단계: 개발 서버 시작

터미널을 열고:

```bash
cd /home/user/yegame-mobile
npm start
```

그러면 다음과 같이 나타납니다:
```
› Metro waiting on exp://192.168.1.xxx:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

### 3단계: QR 코드 스캔

**Android**
1. Expo Go 앱 열기
2. "Scan QR code" 탭 클릭
3. 터미널에 나타난 QR 코드 스캔

**iOS**
1. 카메라 앱 열기
2. QR 코드에 카메라 향하기
3. 알림 클릭하여 Expo Go에서 열기

### 4단계: 앱 확인!

앱이 스마트폰에서 실행됩니다! 🎉

---

## 🧪 테스트 시나리오

### 1️⃣ 회원가입 테스트

1. 앱 실행
2. "회원가입" 탭 클릭
3. 사용자명, 이메일, 비밀번호 입력
4. "회원가입" 버튼 클릭
5. ✅ 자동으로 로그인되고 홈 화면으로 이동
6. ✅ 상단에 "💰 10,000" (초기 코인) 표시

### 2️⃣ 이슈 탐색 테스트

1. 홈 화면에서 카테고리 필터 확인
2. "정치", "스포츠", "코인" 등 카테고리 클릭
3. 이슈 카드 확인
4. ✅ 각 이슈의 확률 바 표시
5. ✅ Yes/No 비율 표시

### 3️⃣ 베팅 테스트

1. 이슈 카드 클릭하여 상세 페이지 진입
2. "Yes" 또는 "No" 선택
3. 베팅 금액 입력 (예: 1000)
4. "베팅하기" 버튼 클릭
5. ✅ "베팅이 완료되었습니다!" 알림
6. ✅ 코인 감소 확인 (10,000 → 9,000)

### 4️⃣ 내 정보 확인

1. 하단 탭에서 "내 정보" 클릭
2. ✅ 사용자 정보 표시
3. ✅ 보유 코인 표시
4. ✅ 베팅 내역 리스트 표시
5. 베팅한 이슈 확인

### 5️⃣ 검색 테스트

1. 하단 탭에서 "이슈" 클릭
2. 상단 검색창에 키워드 입력
3. ✅ 검색 결과 실시간 필터링

---

## 🐛 문제 해결

### "Network Error" 발생 시

**원인**: 백엔드 API 연결 실패

**해결 방법**:
1. 백엔드가 실행 중인지 확인
   ```bash
   curl https://yegam.ai.kr/api/issues
   ```
2. 응답이 있으면 정상, 없으면 Railway 배포 확인

### "Failed to load issues" 발생 시

**원인**: 데이터베이스에 이슈가 없음

**해결 방법**:
1. Railway 대시보드에서 배포 로그 확인
2. 데이터베이스 초기화가 정상적으로 완료되었는지 확인
3. 백엔드 재배포

### 앱이 로딩만 되고 화면이 안 나올 때

**원인**: JavaScript 오류

**해결 방법**:
1. 터미널에서 에러 메시지 확인
2. Expo Go 앱에서 에러 화면 확인
3. 앱을 흔들어서 Developer Menu → "Reload" 클릭

### 컴퓨터와 스마트폰이 다른 Wi-Fi에 연결됨

**원인**: 같은 네트워크에 있지 않음

**해결 방법**:
1. 컴퓨터와 스마트폰을 같은 Wi-Fi에 연결
2. 또는 Expo Go에서 "Tunnel" 모드 사용:
   ```bash
   npm start -- --tunnel
   ```

---

## 📊 백엔드 API 테스트

터미널에서 직접 API 테스트:

### 이슈 목록 조회
```bash
curl https://yegam.ai.kr/api/issues
```

### 회원가입
```bash
curl -X POST https://yegam.ai.kr/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 로그인
```bash
curl -X POST https://yegam.ai.kr/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## 🎯 다음 단계

테스트가 성공하면:

1. ✅ 앱 기능 테스트 완료
2. ⏳ 버그 수정 및 개선
3. ⏳ 앱 아이콘 및 스플래시 이미지 제작
4. ⏳ EAS Build로 APK/IPA 빌드
5. ⏳ Google Play Store / Apple App Store 등록

---

## 💡 유용한 팁

**개발 중 자주 사용하는 명령어**:

```bash
# 개발 서버 시작
npm start

# 캐시 삭제 후 시작 (문제 발생 시)
npm start -- --clear

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행 (macOS만)
npm run ios
```

**Expo Go에서 유용한 단축키**:
- 앱 흔들기 → Developer Menu 열기
- Developer Menu → Reload (앱 재시작)
- Developer Menu → Debug Remote JS (디버깅)

---

**테스트 즐기세요!** 🎉

문제가 발생하면 언제든 질문하세요!
