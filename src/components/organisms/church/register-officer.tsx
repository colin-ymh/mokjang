import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import { OfficersApi } from '@/api/management/officer/officers.api';
import { usePageRouter } from '@/utils/router';
import RegisterOfficerView from '@/components/organisms/church/register-officer.view';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { setOfficers } from '@/redux/reducers/church-reducer';
import Loading from '@/components/atoms/common/etc/loading';

type OfficerListProps = {};

const RegisterOfficer = ({}: OfficerListProps) => {
  const officersApi = new OfficersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const { churchId, officers } = useSelector(
    (state: RootState) => state.church
  );
  const router = usePageRouter();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 선택된 직분
  const [selectedOfficer, setSelectedOfficer] =
    useState<Officer>(DEFAULT_OFFICER);

  // 새로운 직분 이름
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  // 이름 변경
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setNewOfficerName(newName);
  };

  // 새로운 직분 저장
  const onClickSaveOfficer = async () => {
    try {
      if (getIsWellFormedTitle(newOfficerName)) {
        await officersApi.createOfficer({ churchId }, { name: newOfficerName });
        fetchOfficers();
        setNewOfficerName(BLANK);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 직분 불러오기
  const fetchOfficers = async () => {
    try {
      const response = await officersApi.getOfficers({ churchId });
      if (response.status === 200) {
        const newOfficers = response.data;
        dispatch(setOfficers(newOfficers));
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 다음 설정으로 이동
  const onClickSave = () => {
    setIsLoading(true);
    try {
      router.replace('church/register/education');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (churchId) {
      fetchOfficers();
    }
  }, [churchId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // !!!!!!!!!!!! 시발 !!!!!!!!!!!!
      // 한글 키보드로 입력 시, compose 를 하네;;;;;이 개같은거
      // isComposing 이 true => false 이 지랄을 하면서
      // 엔터가 두 번 입력되는 것 처럼 보였던 것이다
      // 이 개같은 것 때문에 시간을 존나 날려먹었다
      // !!!!!!!!!!!! 시발 !!!!!!!!!!!!
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (getIsWellFormedTitle(newOfficerName)) {
          onClickSaveOfficer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [newOfficerName]);

  const props = {
    officers,
    selectedOfficerId: selectedOfficer.id,
    setSelectedOfficer,
    fetchOfficers,
    nameInputRef,
    newOfficerName,
    onChangeName,
    onClickSaveOfficer,
    onClickSave,
  };
  return (
    <>
      <RegisterOfficerView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default RegisterOfficer;
