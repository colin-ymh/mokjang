import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { OfficersApi } from '@/api/management/officer/officers.api';
import OfficerManagementView from '@/components/organisms/management/officer/officer-management.view';
import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchOfficers } from '@/redux/reducers/church-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

type OfficerManagementProps = {};

const OfficerManagement = ({}: OfficerManagementProps) => {
  const t_popup = useScopedI18n('popup');
  const officersApi = new OfficersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const { churchId, officers } = useSelector(
    (state: RootState) => state.church
  );
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 선택된 직분
  const [selectedOfficer, setSelectedOfficer] =
    useState<Officer>(DEFAULT_OFFICER);

  // 새로운 직분 추가 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // 새로운 직분 이름
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  // 직분 추가 모달 열기
  const onClickModalOpen = () => {
    setIsAddModalShown(true);

    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

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
        dispatch(fetchOfficers());
        setIsAddModalShown(false);
        setNewOfficerName(BLANK);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // 수정 중 focus 가 풀리면 수정 취소
  useEffect(() => {
    const inputElement = nameInputRef.current;

    const handleBlur = () => {
      setIsAddModalShown(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [nameInputRef]);

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
        } else {
          setIsAddModalShown(false);
        }
      } else if (e.key === 'Escape') {
        setIsAddModalShown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [newOfficerName]);

  const props = {
    officers,
    fetchOfficers,
    selectedOfficer,
    setSelectedOfficer,
    isAddModalShown,
    nameInputRef,
    newOfficerName,
    onClickModalOpen,
    onChangeName,
    onClickSaveOfficer,
  };

  return (
    <>
      <OfficerManagementView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </>
  );
};

export default OfficerManagement;
