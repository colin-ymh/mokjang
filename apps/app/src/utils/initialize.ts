import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

import { MinistriesApi } from '../api/management/ministry/ministries.api';
import {
  fetchGroups,
  fetchMinistryGroups,
  fetchOfficers,
  setChurch,
  setChurchId,
} from '../redux/reducers/church-reducer';
import { usePageRouter } from '@mokjang/utils';
import { setUser, setUserInitialized } from '../redux/reducers/user-reducer';
import { UserApi } from '../api/user/user.api';
import { fetchPermissionUnits } from '../redux/reducers/filter/permission-template-filter-reducer';
import { ChurchesApi } from '../api/churches/churches.api';
import { User } from '@mokjang/models';

export const useInitializeChurch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((s: RootState) => s.church.churchId);

  /* ✔️ 1회 실행 여부 저장 */
  const didRunRef = useRef(false);

  const ministriesApi = useMemo(() => new MinistriesApi(false), []);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  /* 실제 초기화 함수 */
  const initialize = useCallback(async () => {
    if (didRunRef.current) return; // 이미 실행했으면 무시
    if (!churchId) {
      // console.log('교회 ID 없음');
      return;
    }
    didRunRef.current = true; // ➜ 더 이상 실행 금지

    try {
      await Promise.all([
        dispatch(fetchGroups()),
        dispatch(fetchMinistryGroups()),
        dispatch(fetchOfficers()),
        dispatch(fetchPermissionUnits({})),
      ]);
    } catch (err) {
      setThrownError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [churchId, dispatch, ministriesApi]);

  /* churchId 값이 처음 생겼을 때만 실행 */
  useEffect(() => {
    if (churchId) initialize();
  }, [churchId, initialize]);

  return initialize; // 필요하면 밖에서 수동 호출도 가능
};

// 초기 유저 정보를 확인해 리다이렉트
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
      // const response = await userApi.getMy();
      const response = await userApi.getMy();
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
        setRedirectPath('/church/register');
      }
    } catch (error) {
      // 로그인 안 되었거나 API 실패 시
      setRedirectPath('/login');
    } finally {
      // 어떤 경우에도 초기화 완료
      dispatch(setUserInitialized());
    }
  }, [dispatch, router, userApi, churchesApi]);
};
