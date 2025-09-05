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
import { AuthApi } from '../api/auth/auth.api';
import { usePageRouter } from '@mokjang/utils';
import { setUser } from '../redux/reducers/user-reducer';
import { UserApi } from '../api/user/user.api';
import { fetchPermissionUnits } from '../redux/reducers/filter/permission-template-filter-reducer';
import { ChurchesApi } from '../api/churches/churches.api';
import { User } from '@mokjang/models';
import { SubscriptionApi } from '@/api/subscription/subscription.api';
import { SubscriptionPlan } from '@mokjang/models';
import { setSubscription } from '@/redux/reducers/subscription-reducer';

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
      console.log('교회 ID 없음');
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
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);
  const subscriptionApi = new SubscriptionApi(false);
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

    try {
      const subResponse = await subscriptionApi.getCurrentSubscription();
      const currentPlan: SubscriptionPlan = subResponse.data;

      const response = await userApi.getUser();
      const user: User = response.data;

      dispatch(setSubscription(currentPlan));
      dispatch(setUser(user));
      if (user.churchUser.length) {
        const churchId = user.churchUser[0].churchId;
        dispatch(setChurchId(churchId));

        await churchesApi.getChurch({ churchId }).then((res) => {
          const newChurch = res.data;
          dispatch(setChurch(newChurch));
        });
        setRedirectPath('/main');
      } else if (currentPlan.isCurrent) {
        setRedirectPath('/church/register');
      } else {
        // routeLandingPage('/');
      }
    } catch {
      const response = await userApi.getUser();
      const user: User = response.data;

      if (user.churchUser.length) {
        const churchId = user.churchUser[0].churchId;
        dispatch(setChurchId(churchId));

        await churchesApi.getChurch({ churchId }).then((res) => {
          const newChurch = res.data;
          dispatch(setChurch(newChurch));
        });

        setRedirectPath('/main');
      } else {
        // routeLandingPage('/');
      }
    }
  }, [authApi, userApi, dispatch]);
};
