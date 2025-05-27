import axios from 'axios';

import { TEST_SERVER_URL } from '@/constants/state/url';

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

const authorizeAxios = axios.create({
  baseURL: TEST_SERVER_URL,
  withCredentials: true,
});

// // 요청 인터셉터
// authorizeAxios.interceptors.request.use((config) => {
//   // token 이 세팅되어 있다면 Authorization 헤더 추가
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   // console.log('Authorization Header:', config.headers.Authorization);
//   return config;
// });

// 응답 인터셉터: Access Token 만료 시 Refresh Token을 사용해 재발급
authorizeAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Access Token이 만료된 경우 처리
    if (error.status === 401) {
      const originalRequest = error.config;

      try {
        // Refresh Token을 Authorization 헤더에 추가하여 새로운 Access Token 요청
        // const refreshResponse =
        await axios.post(`${TEST_SERVER_URL}/auth/token/rotate`);
        // 재시도
        return authorizeAxios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authorizeAxios;
