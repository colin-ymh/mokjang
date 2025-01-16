import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getFormattedName } from '@/utils/format';
import { getIsWellFormedName } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import { GroupRole } from '@/models/management/management';
import ManagementRoleItemView from '@/components/atoms/management/group/management-role-item.view';

type ManagementRoleItemProps = {
  role: GroupRole;
  roles: GroupRole[];
  selectedRoleId: string | null;
  setRoles: Dispatch<SetStateAction<GroupRole[]>>;
  setSelectedRole: Dispatch<SetStateAction<GroupRole>>;
};

const ManagementRoleItem = ({
  role,
  roles,
  selectedRoleId,
  setRoles,
  setSelectedRole,
}: ManagementRoleItemProps) => {
  // 이름 수정창 ref
  const nameInputRef = useRef<HTMLInputElement>(null);

  // 새로 추가하는 그룹 입력창 ref
  const newRoleRef = useRef<HTMLInputElement>(null);

  // 새로 추가중인지 여부
  const [isAddShown, setIsAddShown] = useState<boolean>(false);

  // 새 그룹의 이름
  const [newRoleName, setNewRoleName] = useState<string>(BLANK);

  // 수정중인지 여부
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 수정되는 이름
  const [editName, setEditName] = useState<string>(role.role);

  // 새그룹 이름 변경
  const onChangeNewRoleName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setNewRoleName(newName);
  };

  // 새로운 그룹 추가하기
  const onClickSaveNewRole = () => {
    if (getIsWellFormedName(newRoleName)) {
      setRoles([
        ...roles,
        {
          role: newRoleName,
          // 나머지는 다 임시 추가
          id: new Date().toISOString(),
          churchId: new Date().toISOString(),
          groupId: new Date().toISOString(),
        },
      ]);
    }
  };

  // 확인 중인 그룹 변경
  const onClickRole = (role: GroupRole) => {
    setSelectedRole(role);
  };

  // 그룹 수정 활성화
  const onClickRoleEdit = () => {
    setEditName(role.role);
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
  const onClickRoleDelete = (roleId: string) => {
    const newRoles = roles.filter((role) => role.id !== roleId);
    setRoles(newRoles);
  };

  // 그룹 추가 활성화
  const onClickRoleAdd = () => {
    setIsAddShown(true);
    setTimeout(() => {
      if (newRoleRef.current) {
        newRoleRef.current.focus();
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
    if (editName === role.role) {
      setIsEdit(false);
    } else if (getIsWellFormedName(editName)) {
      const newRoles = roles.map((role) => {
        return role.id !== selectedRoleId
          ? role
          : {
              ...role,
              role: editName,
            };
      });
      setRoles(newRoles);
      setIsEdit(false);
    }
  };

  // 드래그 이후 드롭
  const onDropRole = (roleId: string, parentRoleId: string | null) => {};

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
    const inputElement = newRoleRef.current;

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
  }, [newRoleRef, isAddShown]);

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
        } else if (newRoleRef.current === document.activeElement) {
          if (getIsWellFormedName(newRoleName)) {
            onClickSaveNewRole();
          } else {
            setIsAddShown(false);
          }
        }
      } else if (e.key === 'Escape') {
        if (nameInputRef.current === document.activeElement) {
          setIsEdit(false);
        } else if (newRoleRef.current === document.activeElement) {
          setIsAddShown(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editName, newRoleName, onClickSaveName, onClickSaveNewRole]);

  const props = {
    isEdit,
    nameInputRef,
    selectedRoleId,
    role,
    editName,
    onDropRole,
    onClickRole,
    onClickRoleEdit,
    onClickRoleDelete,
    onClickRoleAdd,
    onChangeName,
    onClickSaveName,
  };

  return (
    <>
      <ManagementRoleItemView {...props} />
    </>
  );
};

export default ManagementRoleItem;
