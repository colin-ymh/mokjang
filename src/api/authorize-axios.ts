import axios from 'axios';

import { TEST_SERVER_URL } from '@/constants/state/url';
import { usePageRouter } from '@/utils/router';

let token: string | null = null;

/**
 * 외부에서 토큰을 세팅하는 함수
 */
export function setAuthorizationToken(newToken: string, refreshToken?: string) {
  token = newToken;
  localStorage.setItem('accessToken', newToken); // Access Token 저장

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken); // Refresh Token 저장
  }
}

const authorizeAxios = axios.create({
  baseURL: TEST_SERVER_URL,
});

// 요청 인터셉터
authorizeAxios.interceptors.request.use((config) => {
  // token 이 세팅되어 있다면 Authorization 헤더 추가
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log('Authorization Header:', config.headers.Authorization);
  return config;
});

// 응답 인터셉터: Access Token 만료 시 Refresh Token을 사용해 재발급
authorizeAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const router = usePageRouter();
    const originalRequest = error.config;

    // Access Token이 만료된 경우 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        // Refresh Token이 없으면 로그인 페이지로 리다이렉트
        localStorage.removeItem('accessToken');
        router.push('/login');
        return Promise.reject(error);
      }

      try {
        // Refresh Token을 Authorization 헤더에 추가하여 새로운 Access Token 요청
        const refreshResponse = await axios.post(
          `${TEST_SERVER_URL}/auth/token/rotate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // **Refresh Token 사용**
            },
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // 새로운 Access Token 저장 및 적용
        setAuthorizationToken(newAccessToken);

        // 원래 요청에 새로운 Access Token 설정 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authorizeAxios(originalRequest);
      } catch (refreshError) {
        // Refresh Token 만료 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authorizeAxios;
