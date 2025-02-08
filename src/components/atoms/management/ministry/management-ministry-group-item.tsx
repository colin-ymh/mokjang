import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import ManagementMinistryGroupItemView from '@/components/atoms/management/ministry/management-ministry-group-item.view';
import AddMinistryGroup from '@/components/atoms/management/ministry/add-ministry-group';

type ManagementMinistryGroupItemProps = {
  ministryGroup: MinistryGroup;
  level: number;
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
  closedMinistryGroups: Set<number>;
  fetchMinistryGroups: () => void;
  onClickToggle: (id: string) => void;
};

const ManagementMinistryMinistryGroupItem = ({
  ministryGroup,
  level,
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
  closedMinistryGroups,
  fetchMinistryGroups,
  onClickToggle,
}: ManagementMinistryGroupItemProps) => {
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const isHaveChildren =
    ministryGroup.childMinistryGroups &&
    ministryGroup.childMinistryGroups.length > 0;
  const isOpen = !closedMinistryGroups.has(
    parseInt(ministryGroup.id as string)
  );

  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newMinistryGroupRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newMinistryGroupName, setNewMinistryGroupName] =
    useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(ministryGroup.name);

  // 새그룹 이름 변경
  const onChangeNewMinistryGroupName = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setNewMinistryGroupName(getFormattedTitle(event.target.value));
  };

  // 새로운 그룹 추가하기
  const onClickSaveNewMinistryGroup = async () => {
    if (!getIsWellFormedTitle(newMinistryGroupName)) return;

    try {
      await ministryGroupsApi.createMinistryGroup(
        { churchId },
        {
          name: newMinistryGroupName,
          parentMinistryGroupId: ministryGroup.id,
        }
      );
      fetchMinistryGroups();
      setIsAddShown(false);
      setNewMinistryGroupName(BLANK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 확인 중인 그룹 변경
  const onClickMinistryGroup = async (ministryGroupId: string | null) => {
    if (!ministryGroupId) return;

    try {
      const response = await ministryGroupsApi.getMinistryGroup({
        churchId,
        ministryGroupId,
      });
      setSelectedMinistryGroup(response.data);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 그룹 수정 활성화
  const onClickMinistryGroupEdit = () => {
    setEditName(ministryGroup.name);
    setIsEdit(true);
    setTimeout(() => nameInputRef.current?.focus());
  };

  // 그룹 삭제
  const onClickMinistryGroupDelete = async (ministryGroupId: string) => {
    try {
      await ministryGroupsApi.deleteMinistryGroup({
        churchId,
        ministryGroupId,
      });
      fetchMinistryGroups();
      setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 그룹 추가 활성화
  const onClickMinistryGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => newMinistryGroupRef.current?.focus());
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  // 수정된 이름 저장
  const onClickSaveName = async () => {
    if (editName === ministryGroup.name || !getIsWellFormedTitle(editName)) {
      setIsEdit(false);
      return;
    }

    try {
      const response = await ministryGroupsApi.editMinistryGroup(
        { churchId, ministryGroupId: ministryGroup.id as string },
        { name: editName }
      );
      setSelectedMinistryGroup(response.data);
      fetchMinistryGroups();
      setIsEdit(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 드래그 이후 드롭
  const onDropMinistryGroup = async (
    ministryGroupId: string,
    parentMinistryGroupId: string | null
  ) => {
    if (ministryGroupId === parentMinistryGroupId) return;

    try {
      await ministryGroupsApi.editMinistryGroup(
        { churchId, ministryGroupId },
        { parentMinistryGroupId }
      );
      fetchMinistryGroups();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    const handleBlur = () => setIsEdit(false);
    nameInputRef.current?.addEventListener('blur', handleBlur);
    return () => nameInputRef.current?.removeEventListener('blur', handleBlur);
  }, [isEdit]);

  useEffect(() => {
    const handleBlur = () => setIsAddShown(false);
    newMinistryGroupRef.current?.addEventListener('blur', handleBlur);
    return () =>
      newMinistryGroupRef.current?.removeEventListener('blur', handleBlur);
  }, [isAddShown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        if (nameInputRef.current === document.activeElement) {
          onClickSaveName();
        } else if (newMinistryGroupRef.current === document.activeElement) {
          onClickSaveNewMinistryGroup();
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newMinistryGroupRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editName, newMinistryGroupName]);

  const props = {
    isHaveChildren,
    isOpen,
    isEdit,
    nameInputRef,
    selectedMinistryGroupId,
    ministryGroup,
    level,
    editName,
    onDropMinistryGroup,
    onClickToggle,
    onClickMinistryGroup,
    onClickMinistryGroupEdit,
    onClickMinistryGroupDelete,
    onClickMinistryGroupAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementMinistryGroupItemView {...props} />
      <AddMinistryGroup
        ref={newMinistryGroupRef}
        isShown={isAddShown}
        level={level}
        name={newMinistryGroupName}
        onChangeName={onChangeNewMinistryGroupName}
        onClickSaveMinistryGroup={onClickSaveNewMinistryGroup}
      />
      {isOpen &&
        ministryGroup.childMinistryGroups?.map((childMinistryGroup) => (
          <ManagementMinistryMinistryGroupItem
            key={childMinistryGroup.id}
            ministryGroup={childMinistryGroup}
            level={level + 1}
            selectedMinistryGroupId={selectedMinistryGroupId}
            setSelectedMinistryGroup={setSelectedMinistryGroup}
            closedMinistryGroups={closedMinistryGroups}
            fetchMinistryGroups={fetchMinistryGroups}
            onClickToggle={onClickToggle}
          />
        ))}
    </>
  );
};

export default ManagementMinistryMinistryGroupItem;
