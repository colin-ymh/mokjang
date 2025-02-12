import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { EducationsApi } from '@/api/management/education/educations.api';
import { OfficersApi } from '@/api/management/officer/officers.api';
import {
  setChurch,
  setChurchId,
  setEducations,
  setGroups,
  setMinistries,
  setMinistryGroups,
  setOfficers,
} from '@/redux/reducers/church-reducer';
import { GroupsApi } from '@/api/management/group/groups.api';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import { AuthApi } from '@/api/auth/auth.api';
import { setAuthorizationToken } from '@/api/authorize-axios';
import { setUser } from '@/redux/reducers/user-reducer';
import { useRouter } from 'next/navigation';

export const useInitializeChurch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const ministryGroupsApi = new MinistryGroupsApi(false);
  const ministriesApi = new MinistriesApi(false);
  const officersApi = new OfficersApi(false);
  const educationsApi = new EducationsApi(false);
  const groupsApi = new GroupsApi(false);

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
      const [ministryGroups, ministries, officers, educations, groups] =
        await Promise.all([
          ministryGroupsApi.getMinistryGroups({ churchId }),
          ministriesApi.getMinistries({ churchId }),
          officersApi.getOfficers({ churchId }),
          educationsApi.getEducations({ churchId }),
          groupsApi.getGroups({ churchId }),
        ]);

      dispatch(setMinistryGroups(ministryGroups.data));
      dispatch(setMinistries(ministries.data));
      dispatch(setOfficers(officers.data));
      dispatch(setEducations(educations.data.data));
      dispatch(setGroups(groups.data));
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

export const useInitializeUser = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authApi = new AuthApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  return async () => {
    try {
      // 1) 로컬 스토리지에서 Access/Refresh Token 가져오기
      const accessToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refreshToken')
          : null;
      // console.log('accessToken', accessToken);
      // console.log('refreshToken', refreshToken);

      // 2) Access Token이 없으면 Refresh Token 확인
      if (!accessToken) {
        // Refresh Token도 없으면 → 로그인 화면
        if (!refreshToken) {
          router.replace('/login');
          return;
        } else {
          setAuthorizationToken(refreshToken);

          // Refresh Token을 Authorization 헤더에 추가하여 새로운 Access Token 요청
          const refreshResponse = await authApi.getRefreshToken();

          const newAccessToken = refreshResponse.data.accessToken;

          if (!newAccessToken) {
            // 실패 시 로그인
            router.replace('/login');
            return;
          }

          // 새 Access Token 저장
          setAuthorizationToken(newAccessToken);
        }
      } else {
        // Access Token이 있다면 일단 설정
        setAuthorizationToken(accessToken);
      }

      // 3) 이제 사용자 정보를 요청 (이미 Access Token이 설정된 상태)
      const response = await authApi.getUser();
      const newUser = response.data;

      // 4) Redux 상태 업데이트
      dispatch(setUser(newUser));
      // 교회 정보가 있다면 상태 저장 후 홈으로 이동
      if (newUser?.adminChurch?.id || newUser?.managingChurch?.id) {
        const c = newUser.adminChurch || newUser.managingChurch;
        dispatch(setChurch(c));
        dispatch(setChurchId(c.id));
        router.replace('');
      } else {
        // 교회가 없으면 교회 등록
        router.replace('/church/register');
      }
    } catch (error: any) {
      // 토큰이 유효하지 않으면 삭제 후 로그인 페이지로 이동
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setThrownError(
        error instanceof Error ? error : new Error('Unknown error')
      );
      router.replace('/login');
    }
  };
};
