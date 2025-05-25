import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { EducationsApi } from '@/api/education/educations.api';
import {
  fetchGroups,
  fetchMinistryGroups,
  fetchOfficers,
  setChurch,
  setChurchId,
  setMinistries,
} from '@/redux/reducers/church-reducer';
import { AuthApi } from '@/api/auth/auth.api';
import { usePageRouter } from '@/utils/router';
import { setUser } from '@/redux/reducers/user-reducer';
import { UserApi } from '@/api/user/user.api';
import { setEducations } from '@/redux/reducers/filter/education-filter-reducer';

export const useInitializeChurch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const ministriesApi = new MinistriesApi(false);
  const educationsApi = new EducationsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const initialize = async () => {
    if (!churchId) {
      console.warn('교회 ID가 설정되지 않았습니다.');
      return;
    }

    try {
      dispatch(fetchGroups());
      dispatch(fetchMinistryGroups());
      dispatch(fetchOfficers());

      const [ministries, educations] = await Promise.all([
        ministriesApi.getMinistries({ churchId }),
        educationsApi.getEducations({ churchId }),
      ]);

      dispatch(setMinistries(ministries.data.data));
      dispatch(setEducations(educations.data.data));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (churchId) {
      initialize();
    }
  }, [churchId]);

  return initialize;
};

// 초기 유저 정보를 확인해 리다이렉트
export const useInitializeUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  return async () => {
    try {
      // (1) 임시 토큰 체크
      const temporalResponse = await authApi.getIsTemporalToken();
      const isTemporalToken = temporalResponse.data;

      if (isTemporalToken) {
        // 임시 토큰만 있으면 회원가입 진행 페이지로
        router.replace('/login/register');
        return;
      }
    } catch (error) {
      // console.log('No Temporal Token');
    }

    try {
      // (2) Access Token으로 유저 정보 가져오기
      const response = await userApi.getUser();
      const newUser = response.data;

      // (3) Redux에 사용자 정보 저장
      dispatch(setUser(newUser));

      // (4) 교회 정보 확인 후 라우팅
      const c = newUser.church;

      if (c?.id) {
        dispatch(setChurch(c));
        dispatch(setChurchId(c.id));
        // router.replace('/admin');
      } else {
        router.replace('/church/register');
      }
    } catch (error: any) {
      // (5) Access Token 인증 실패 → 로그인 페이지
      router.replace('/login');
    }
  };
};
