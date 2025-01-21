import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import { OfficersApi } from '@/api/management/officer/officers.api';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import ManagementOfficerItemView from '@/components/atoms/management/officer/management-officer-item.view';

type ManagementOfficerItemProps = {
  officer: Officer;
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
  fetchOfficers: () => void;
};

const ManagementOfficerItem = ({
  officer,
  selectedOfficerId,
  setSelectedOfficer,
  fetchOfficers,
}: ManagementOfficerItemProps) => {
  const officersApi = new OfficersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newOfficerRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(officer.name);

  // 새로운 그룹 추가하기
  const onClickSaveNewOfficer = () => {
    if (getIsWellFormedTitle(newOfficerName)) {
      officersApi
        .createOfficer({ churchId }, { name: newOfficerName })
        .then(() => {
          fetchOfficers();
          setIsAddShown(false);
          setNewOfficerName(BLANK);
        });
    }
  };

  // 확인 중인 그룹 변경
  const onClickOfficer = (officerId: string | null) => {};

  // 그룹 수정 활성화
  const onClickOfficerEdit = () => {
    setEditName(officer.name);
    setIsEdit(true);

    // isEdit이 true로 전환된 이후
    setTimeout(() => {
      // 포커스
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

  // 그룹 삭제
  const onClickOfficerDelete = (officerId: string) => {
    officersApi.deleteOfficer({ churchId, officerId }).then(() => {
      fetchOfficers();
      setSelectedOfficer(DEFAULT_OFFICER);
    });
  };

  // 그룹 추가 활성화
  const onClickOfficerAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newOfficerRef.current) {
        newOfficerRef.current.focus();
      }
    });
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    setEditName(newName);
  };

  // 수정된 이름 저장
  const onClickSaveName = () => {
    if (editName === officer.name) {
      setIsEdit(false);
    } else if (getIsWellFormedTitle(editName)) {
      officersApi
        .editOfficer(
          { churchId, officerId: officer.id as string },
          { name: editName }
        )
        .then((response) => {
          setSelectedOfficer(response.data);
          fetchOfficers();
          setIsEdit(false);
        });
    }
  };

  // 드래그 이후 드롭
  const onDropOfficer = (
    officerId: string,
    parentOfficerId: string | null
  ) => {};

  // 수정 중 focus 가 풀리면 수정 취소
  useEffect(() => {
    const inputElement = nameInputRef.current;

    const handleBlur = () => {
      setIsEdit(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [nameInputRef, isEdit]);

  // 추가 중 focus 가 풀리면 추가 취소
  useEffect(() => {
    const inputElement = newOfficerRef.current;

    const handleBlur = () => {
      setIsAddShown(false);
    };

    if (inputElement) {
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, [newOfficerRef, isAddShown]);

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
        if (nameInputRef.current === document.activeElement) {
          if (getIsWellFormedTitle(editName)) {
            onClickSaveName();
          } else {
            setIsEdit(false);
          }
        } else if (newOfficerRef.current === document.activeElement) {
          if (getIsWellFormedTitle(newOfficerName)) {
            onClickSaveNewOfficer();
          } else {
            setIsAddShown(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newOfficerRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, newOfficerName, onClickSaveName, onClickSaveNewOfficer]);

  const props = {
    isEdit,
    nameInputRef,
    selectedOfficerId,
    officer,
    editName,
    onDropOfficer,
    onClickOfficer,
    onClickOfficerEdit,
    onClickOfficerDelete,
    onClickOfficerAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementOfficerItemView {...props} />
    </>
  );
};

export default ManagementOfficerItem;
