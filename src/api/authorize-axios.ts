import axios from "axios";
import { TEST_SERVER_URL } from "@/constants/state/url";

let token: string | null = null;

/**
 * 외부에서 토큰을 세팅하는 함수
 */
export function setAuthorizationToken(newToken: string) {
  token = newToken;
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
  return config;
});

export default authorizeAxios;
