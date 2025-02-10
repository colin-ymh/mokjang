import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
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
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

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
  const onClickSaveNewOfficer = async () => {
    if (!getIsWellFormedTitle(newOfficerName)) return;

    try {
      await officersApi.createOfficer({ churchId }, { name: newOfficerName });
      fetchOfficers();
      setIsAddShown(false);
      setNewOfficerName(BLANK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
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
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    });
  };

  // 그룹 삭제
  const onClickOfficerDelete = async (officerId: string) => {
    try {
      await officersApi.deleteOfficer({ churchId, officerId });
      fetchOfficers();
      setSelectedOfficer(DEFAULT_OFFICER);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
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
    setEditName(getFormattedTitle(event.target.value));
  };

  // 수정된 이름 저장
  const onClickSaveName = async () => {
    if (editName === officer.name || !getIsWellFormedTitle(editName)) {
      setIsEdit(false);
      return;
    }

    try {
      const response = await officersApi.editOfficer(
        { churchId, officerId: officer.id as string },
        { name: editName }
      );
      setSelectedOfficer(response.data);
      fetchOfficers();
      setIsEdit(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 드래그 이후 드롭
  const onDropOfficer = (
    officerId: string,
    parentOfficerId: string | null
  ) => {};

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
