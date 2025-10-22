import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 백엔드 API URL - 환경에 따라 변경 필요
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'  // 개발 환경
  : 'https://your-railway-app.up.railway.app/api';  // 프로덕션

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: JWT 토큰 자동 첨부
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 핸들링
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const authAPI = {
  // 로그인
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 회원가입
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 토큰 확인
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

// 이슈 관련 API
export const issuesAPI = {
  // 모든 이슈 조회
  getAllIssues: async () => {
    const response = await api.get('/issues');
    return response.data;
  },

  // 특정 이슈 조회
  getIssue: async (id) => {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  },

  // 이슈 생성 (관리자)
  createIssue: async (issueData) => {
    const response = await api.post('/issues', issueData);
    return response.data;
  },

  // 이슈 수정 (관리자)
  updateIssue: async (id, issueData) => {
    const response = await api.put(`/issues/${id}`, issueData);
    return response.data;
  },

  // 이슈 삭제 (관리자)
  deleteIssue: async (id) => {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  },

  // 인기 이슈 토글 (관리자)
  togglePopular: async (id) => {
    const response = await api.patch(`/issues/${id}/toggle-popular`);
    return response.data;
  },
};

// 베팅 관련 API
export const betsAPI = {
  // 베팅하기
  placeBet: async (userId, issueId, choice, amount) => {
    const response = await api.post('/bets', {
      userId,
      issueId,
      choice,
      amount,
    });
    return response.data;
  },

  // 사용자 베팅 내역 조회
  getUserBets: async (userId) => {
    const response = await api.get(`/bets/user/${userId}`);
    return response.data;
  },

  // 이슈별 베팅 통계
  getBetStats: async (issueId) => {
    const response = await api.get(`/bets/stats/${issueId}`);
    return response.data;
  },
};

export default api;
