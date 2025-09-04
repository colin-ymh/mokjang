import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import { AuthApi } from '@/api/auth/auth.api';
import { UserApi } from '@/api/user/user.api';
import { ChurchesApi } from '@/api/churches/churches.api';
import { User } from '@mokjang/models';
import { setUser } from '@/redux/reducers/user-reducer';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';

// 초기 유저 정보를 확인해 리다이렉트
export const useInitializeUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);
  const churchesApi = new ChurchesApi(false);

  // /** ➜ 이 ref 가 true 면 두 번 다시 실행하지 않음 */
  const didRunRef = useRef(false);

  /** 라우트 이동 시에도 변하지 않는 redirect 상태 */
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  /* redirectPath 가 정해지면 실제 라우팅 */
  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [redirectPath]);

  /** 한 번만 만들어지는 초기화 함수 */
  return useCallback(async () => {
    /* 이미 실행했다면 바로 return */
    if (didRunRef.current) return;
    didRunRef.current = true;

    /* 1) 임시 토큰 체크 */
    try {
      const { data: isTemp } = await authApi.getIsTemporalToken();
      if (isTemp) {
        setRedirectPath('/register');
        return;
      }
    } catch {
      /* 토큰 없음 → 정상 흐름 */
    }

    /* 2) 사용자 정보 조회 */
    try {
      const response = await userApi.getUser();
      const user: User = response.data;
      dispatch(setUser(user));
      if (user.churchUser.length) {
        const churchId = user.churchUser[0].churchId;
        dispatch(setChurchId(churchId));

        await churchesApi.getChurch({ churchId }).then((res) => {
          const newChurch = res.data;
          dispatch(setChurch(newChurch));
        });
      } else {
        // setRedirectPath('/');
      }
    } catch {
      // setRedirectPath('/');
    }
  }, [authApi, userApi, dispatch]);
};
