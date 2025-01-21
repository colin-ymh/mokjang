import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { OfficersApi } from '@/api/management/officers.api';
import OfficerManagementView from '@/components/organisms/management/officer/officer-management.view';
import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';

type OfficerManagementProps = {};

const OfficerManagement = ({}: OfficerManagementProps) => {
  const officersApi = new OfficersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 선택된 교육
  const [selectedOfficer, setSelectedOfficer] =
    useState<Officer>(DEFAULT_OFFICER);

  // 전체 교육 배열
  const [officers, setOfficers] = useState<Officer[]>([]);

  // 새로운 교육 추가 모달 활성화 여부
  const [isAddModalShown, setIsAddModalShown] = useState<boolean>(false);

  // 새로운 교육 이름
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  // 교육 추가 모달 열기
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

  // 새로운 교육 저장
  const onClickSaveOfficer = () => {
    if (getIsWellFormedName(newOfficerName)) {
      officersApi
        .createOfficer({ churchId }, { name: newOfficerName })
        .then(() => {
          fetchOfficers();
          setIsAddModalShown(false);
          setNewOfficerName(BLANK);
        });
    }
  };

  // 교육 불러오기
  const fetchOfficers = () => {
    officersApi.getOfficers({ churchId }).then((response) => {
      if (response.status === 200) {
        const newOfficers = response.data;
        setOfficers(newOfficers);
      }
    });
  };

  // 교회 정보를 통해 교육들 불러오기
  useEffect(() => {
    if (churchId) {
      fetchOfficers();
    }
  }, [churchId]);

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
        if (getIsWellFormedName(newOfficerName)) {
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
    </>
  );
};

export default OfficerManagement;
