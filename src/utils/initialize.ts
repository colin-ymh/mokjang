import { useEffect } from 'react';
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
import { usePageRouter } from '@/utils/router';
import { setAuthorizationToken } from '@/api/authorize-axios';
import { setUser } from '@/redux/reducers/user-reducer';
import { AuthApi } from '@/api/auth/auth.api';

export const useInitializeChurch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const churchId = useSelector((state: RootState) => state.church.churchId); // 전역 상태에서 churchId 가져오기

  const ministryGroupsApi = new MinistryGroupsApi(false);
  const ministriesApi = new MinistriesApi(false);
  const officersApi = new OfficersApi(false);
  const educationsApi = new EducationsApi(false);
  const groupsApi = new GroupsApi(false);

  // **전역 상태의 churchId를 이용하여 초기화**
  const initialize = () => {
    if (!churchId) {
      console.warn('교회 ID가 설정되지 않았습니다.');
      return;
    }

    ministryGroupsApi
      .getMinistryGroups({ churchId })
      .then((response) => dispatch(setMinistryGroups(response.data)))
      .catch((error) => console.error('Ministry Groups 불러오기 실패:', error));

    ministriesApi
      .getMinistries({ churchId })
      .then((response) => dispatch(setMinistries(response.data)))
      .catch((error) => console.error('Ministries 불러오기 실패:', error));

    officersApi
      .getOfficers({ churchId })
      .then((response) => dispatch(setOfficers(response.data)))
      .catch((error) => console.error('Officers 불러오기 실패:', error));

    educationsApi
      .getEducations({ churchId })
      .then((response) => dispatch(setEducations(response.data.data)))
      .catch((error) => console.error('Educations 불러오기 실패:', error));

    groupsApi
      .getGroups({ churchId })
      .then((response) => dispatch(setGroups(response.data)))
      .catch((error) => console.error('Groups 불러오기 실패:', error));
  };

  // **churchId가 변경될 때마다 자동으로 initialize 호출**
  useEffect(() => {
    if (churchId) {
      initialize(); // 전역 상태의 churchId로 초기화
    }
  }, [churchId]);

  return initialize; // 필요 시 수동으로 호출할 수 있도록 반환
};

export const useInitializeUser = () => {
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authApi = new AuthApi(false);

  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return async () => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      setAuthorizationToken(accessToken);

      // API 요청은 여기서 처리
      const response = await authApi.getUser();
      const newUser = response.data;

      // 상태 업데이트는 여기서 처리
      dispatch(setUser(newUser));

      if (newUser?.adminChurch?.id || newUser?.managingChurch?.id) {
        dispatch(setChurch(newUser.adminChurch));
        dispatch(setChurchId(newUser.adminChurch.id));
        router.push(''); // 홈 페이지로 리다이렉트
      } else {
        router.push('/church/register'); // 교회 등록 페이지로 리다이렉트
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
      router.push('/login');
    }
  };
};
