import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { usePageRouter } from '@mokjang/utils';
import { UserApi } from '@/api/user/user.api';
import { ChurchesApi } from '@/api/churches/churches.api';
import { User } from '@mokjang/models';
import { setUser, setUserInitialized } from '@/redux/reducers/user-reducer';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';

export const useInitializeUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const userApi = new UserApi(false);
  const churchesApi = new ChurchesApi(false);

  const didRunRef = useRef(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (redirectPath) router.replace(redirectPath);
  }, [redirectPath]);

  return useCallback(async () => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    try {
      // 유저 정보 조회
      const response = await userApi.getUser();
      const user: User = response.data.data;
      dispatch(setUser(user));

      // 교회 정보 조회
      const churchUser = user.churchUser?.[0];
      if (churchUser?.churchId) {
        const churchId = churchUser.churchId;
        dispatch(setChurchId(churchId));

        const churchRes = await churchesApi.getChurch({ churchId });
        dispatch(setChurch(churchRes.data));
      } else {
        setRedirectPath('/'); // 교회가 없는 경우 처리
      }
    } catch (error) {
      // 로그인 안 되었거나 API 실패 시
      setRedirectPath('/');
    } finally {
      // 어떤 경우에도 초기화 완료
      dispatch(setUserInitialized());
    }
  }, [dispatch, router, userApi, churchesApi]);
};
