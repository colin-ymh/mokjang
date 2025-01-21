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
import { getIsWellFormedName } from '@/utils/check';
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
    const newName = getFormattedTitle(event.target.value);
    setNewMinistryGroupName(newName);
  };

  // 새로운 그룹 추가하기
  const onClickSaveNewMinistryGroup = () => {
    if (getIsWellFormedName(newMinistryGroupName)) {
      ministryGroupsApi
        .createMinistryGroup(
          { churchId },
          {
            name: newMinistryGroupName,
            parentMinistryGroupId: ministryGroup.id,
          }
        )
        .then(() => {
          fetchMinistryGroups();
          setIsAddShown(false);
          setNewMinistryGroupName(BLANK);
        });
    }
  };

  // 확인 중인 그룹 변경
  const onClickMinistryGroup = (ministryGroupId: string | null) => {
    if (ministryGroupId) {
      ministryGroupsApi
        .getMinistryGroup({ churchId, ministryGroupId })
        .then((response) => {
          const newMinistryGroup: MinistryGroup = response.data;
          setSelectedMinistryGroup(newMinistryGroup);
        });
    }
  };

  // 그룹 수정 활성화
  const onClickMinistryGroupEdit = () => {
    setEditName(ministryGroup.name);
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
  const onClickMinistryGroupDelete = (ministryGroupId: string) => {
    ministryGroupsApi
      .deleteMinistryGroup({ churchId, ministryGroupId })
      .then(() => {
        fetchMinistryGroups();
        setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
      });
  };

  // 그룹 추가 활성화
  const onClickMinistryGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newMinistryGroupRef.current) {
        newMinistryGroupRef.current.focus();
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
    if (editName === ministryGroup.name) {
      setIsEdit(false);
    } else if (getIsWellFormedName(editName)) {
      ministryGroupsApi
        .editMinistryGroup(
          { churchId, ministryGroupId: ministryGroup.id as string },
          { name: editName }
        )
        .then((response) => {
          setSelectedMinistryGroup(response.data);
          fetchMinistryGroups();
          setIsEdit(false);
        });
    }
  };

  // 드래그 이후 드롭
  const onDropMinistryGroup = (
    ministryGroupId: string,
    parentMinistryGroupId: string | null
  ) => {
    if (ministryGroupId !== parentMinistryGroupId) {
      ministryGroupsApi
        .editMinistryGroup(
          { churchId, ministryGroupId },
          { parentMinistryGroupId }
        )
        .then(() => fetchMinistryGroups())
        .catch((error) => {
          console.log(error);
        });
    }
  };

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
    const inputElement = newMinistryGroupRef.current;

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
  }, [newMinistryGroupRef, isAddShown]);

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
          if (getIsWellFormedName(editName)) {
            onClickSaveName();
          } else {
            setIsEdit(false);
          }
        } else if (newMinistryGroupRef.current === document.activeElement) {
          if (getIsWellFormedName(newMinistryGroupName)) {
            onClickSaveNewMinistryGroup();
          } else {
            setIsAddShown(false);
          }
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    editName,
    newMinistryGroupName,
    onClickSaveName,
    onClickSaveNewMinistryGroup,
  ]);

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
        ministryGroup.childMinistryGroups &&
        ministryGroup.childMinistryGroups.length > 0 &&
        ministryGroup.childMinistryGroups.map((childMinistryGroup) => (
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
