import axios from 'axios';

import { TEST_SERVER_URL } from '../constants/state/url';

// let token: string | null = null;

// /**
//  * 외부에서 토큰을 세팅하는 함수
//  */
// export function setAuthorizationToken(newToken: string, refreshToken?: string) {
//   token = newToken;
//   localStorage.setItem('accessToken', newToken); // Access Token 저장
//
//   if (refreshToken) {
//     localStorage.setItem('refreshToken', refreshToken); // Refresh Token 저장
//   }
// }
//
// /**
//  * 외부에서 토큰을 초기화(삭제)하는 함수
//  */
// export function resetAuthorizationToken() {
//   token = null;
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
// }

// // 요청 인터셉터
// authorizeAxios.interceptors.request.use((config) => {
//   // token 이 세팅되어 있다면 Authorization 헤더 추가
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   // console.log('Authorization Header:', config.headers.Authorization);
//   return config;
// });

const authorizeAxios = axios.create({
  baseURL: TEST_SERVER_URL,
  withCredentials: true,
});

// 401 처리용 플래그 키
const RETRY_FLAG = '_retry_by_interceptor';

authorizeAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // ① 재귀 방지: 이미 재시도했거나 /auth/token/rotate 요청이면 패스
    const isRotateCall = config.url?.includes('/auth/token/rotate');
    if (isRotateCall || config[RETRY_FLAG]) {
      return Promise.reject(error);
    }

    // ② 401이면 토큰 재발급 후 원 요청 재시도
    if (response?.status === 401) {
      // console.log('access token not found');
      config[RETRY_FLAG] = true; // 한 번만 재시도

      try {
        // console.log('refresh access token');
        await authorizeAxios.post('/auth/token/rotate');
        // .then((response) => console.log(response)); // Refresh Token은 쿠키로 전송
        return authorizeAxios(config); // Access Token 쿠키로 자동 포함
      } catch (refreshErr) {
        return Promise.reject(refreshErr); // 재발급 실패 → 그대로 오류
      }
    }

    return Promise.reject(error); // 그 외 오류
  }
);

export default authorizeAxios;
