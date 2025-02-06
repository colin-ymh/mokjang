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
import { setAuthorizationToken } from '@/api/authorize-axios';
import { setUser } from '@/redux/reducers/user-reducer';
import { usePageRouter } from '@/utils/router';
import { AuthApi } from '@/api/auth/auth.api';

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
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authApi = new AuthApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  return async () => {
    const accessToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      setAuthorizationToken(accessToken);

      // 사용자 정보 요청
      const response = await authApi.getUser();
      const newUser = response.data;

      // Redux 상태 업데이트
      dispatch(setUser(newUser));

      if (newUser?.adminChurch?.id || newUser?.managingChurch?.id) {
        dispatch(setChurch(newUser.adminChurch));
        dispatch(setChurchId(newUser.adminChurch.id));
        router.push('');
      } else {
        router.push('/church/register');
      }
    } catch (error) {
      // 토큰이 유효하지 않으면 삭제 후 로그인 페이지로 이동
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
      setThrownError(error instanceof Error ? error : new Error(String(error)));
      router.push('/login');
    }
  };
};
