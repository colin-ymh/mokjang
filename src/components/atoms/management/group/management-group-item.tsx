import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DEFAULT_GROUP, Group } from '@/models/management/management';
import ManagementGroupItemView from '@/components/atoms/management/group/management-group-item.view';
import { GroupsApi } from '@/api/management/group/groups.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFormattedName } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';
import AddGroup from '@/components/atoms/management/group/add-group';
import { BLANK } from '@/constants/constant';

type ManagementGroupItemProps = {
  group: Group;
  level: number;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  closedGroups: Set<number>;
  fetchGroups: () => void;
  onClickToggle: (id: string) => void;
};

const ManagementGroupItem = ({
  group,
  level,
  selectedGroupId,
  setSelectedGroup,
  closedGroups,
  fetchGroups,
  onClickToggle,
}: ManagementGroupItemProps) => {
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const isHaveChildren = group.childGroups && group.childGroups.length > 0;
  const isOpen = !closedGroups.has(parseInt(group.id as string));

  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newGroupRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(group.name);

  // 새그룹 이름 변경
  const onChangeNewGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setNewGroupName(newName);
  };

  // 새로운 그룹 추가하기
  const onClickSaveNewGroup = () => {
    if (getIsWellFormedName(newGroupName)) {
      groupsApi
        .createGroup(
          { churchId },
          { name: newGroupName, parentGroupId: group.id }
        )
        .then(() => {
          fetchGroups();
          setIsAddShown(false);
          setNewGroupName(BLANK);
        });
    }
  };

  // 확인 중인 그룹 변경
  const onClickGroup = (groupId: string | null) => {
    if (groupId) {
      groupsApi.getGroup({ churchId, groupId }).then((response) => {
        const newGroup: Group = response.data;
        setSelectedGroup(newGroup);
      });
    }
  };

  // 그룹 수정 활성화
  const onClickGroupEdit = () => {
    setEditName(group.name);
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
  const onClickGroupDelete = (groupId: string) => {
    groupsApi.deleteGroup({ churchId, groupId }).then(() => {
      fetchGroups();
      setSelectedGroup(DEFAULT_GROUP);
    });
  };

  // 그룹 추가 활성화
  const onClickGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newGroupRef.current) {
        newGroupRef.current.focus();
      }
    });
  };

  // 이름 수정 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setEditName(newName);
  };

  // 수정된 이름 저장
  const onClickSaveName = () => {
    if (editName === group.name) {
      setIsEdit(false);
    } else if (getIsWellFormedName(editName)) {
      groupsApi
        .editGroup(
          { churchId, groupId: group.id as string },
          { name: editName }
        )
        .then((response) => {
          setSelectedGroup(response.data);
          fetchGroups();
          setIsEdit(false);
        });
    }
  };

  // 드래그 이후 드롭
  const onDropGroup = (groupId: string, parentGroupId: string | null) => {
    groupsApi
      .editGroup({ churchId, groupId }, { parentGroupId })
      .then(() => fetchGroups())
      .catch((error) => {
        console.log(error);
      });
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
    const inputElement = newGroupRef.current;

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
  }, [newGroupRef, isAddShown]);

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
        } else if (newGroupRef.current === document.activeElement) {
          if (getIsWellFormedName(newGroupName)) {
            onClickSaveNewGroup();
          } else {
            setIsAddShown(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newGroupRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, newGroupName, onClickSaveName, onClickSaveNewGroup]);

  const props = {
    isHaveChildren,
    isOpen,
    isEdit,
    nameInputRef,
    selectedGroupId,
    group,
    level,
    editName,
    onDropGroup,
    onClickToggle,
    onClickGroup,
    onClickGroupEdit,
    onClickGroupDelete,
    onClickGroupAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementGroupItemView {...props} />
      <AddGroup
        ref={newGroupRef}
        isShown={isAddShown}
        level={level}
        name={newGroupName}
        onChangeName={onChangeNewGroupName}
        onClickSaveGroup={onClickSaveNewGroup}
      />
      {isOpen &&
        group.childGroups &&
        group.childGroups.length > 0 &&
        group.childGroups.map((childGroup) => (
          <ManagementGroupItem
            key={childGroup.id}
            group={childGroup}
            level={level + 1}
            selectedGroupId={selectedGroupId}
            setSelectedGroup={setSelectedGroup}
            closedGroups={closedGroups}
            fetchGroups={fetchGroups}
            onClickToggle={onClickToggle}
          />
        ))}
    </>
  );
};

export default ManagementGroupItem;
