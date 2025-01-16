import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_GROUP_ROLE,
  Group,
  GroupRole,
} from '@/models/management/management';
import { GroupRolesApi } from '@/api/management/group/group-roles.api';
import EditGroupView from '@/components/molecules/management/group/edit-group.view';
import { getFormattedName } from '@/utils/format';
import { GroupsApi } from '@/api/management/group/groups.api';
import { BLANK } from '@/constants/constant';
import { getIsWellFormedName } from '@/utils/check';

type EditGroupProps = {
  group: Group;
  roles: GroupRole[];
  onClickClose: () => void;
  fetchGroup: () => void;
  fetchRoles: () => void;
};

const EditGroup = ({
  group,
  roles,
  onClickClose,
  fetchGroup,
  fetchRoles,
}: EditGroupProps) => {
  const groupRolesApi = new GroupRolesApi(false);
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const newRoleRef = useRef<HTMLInputElement>(null);

  // 변경될 이름
  const [newName, setNewName] = useState<string>(group.name);

  // 새로 추가될 역할 이름
  const [newRoleName, setNewRoleName] = useState<string>(BLANK);

  // 선택된 역할
  const [selectedRole, setSelectedRole] =
    useState<GroupRole>(DEFAULT_GROUP_ROLE);

  // 임시 역할 배열
  const [newRoles, setNewRoles] = useState<GroupRole[]>(roles);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(getFormattedName(event.target.value));
  };

  // 새 역할 이름 변경 시 이벤트
  const onChangeNewRoleName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(getFormattedName(event.target.value));
  };

  // 새 역할 임시 저장
  const onClickSaveNewRole = () => {
    setNewRoles([
      ...newRoles,
      {
        role: newRoleName,
        id: new Date().toDateString(),
        churchId: new Date().toDateString(),
        groupId: new Date().toDateString(),
      },
    ]);
    setNewRoleName(BLANK);
  };

  // 저장하기
  const onClickSave = async () => {
    try {
      // 이름 변경
      if (group.name !== newName) {
        await groupsApi.editGroup(
          { churchId, groupId: group.id as string },
          { name: newName }
        );
      }

      // 삭제된 역할
      const deletedRoles = roles.filter((prevRole) =>
        newRoles.every((newRole) => newRole.id !== prevRole.id)
      );

      // 수정된 역할
      const updatedRoles = newRoles.filter((newRole) =>
        roles.some(
          (prevRole) =>
            prevRole.id === newRole.id && prevRole.role !== newRole.role
        )
      );

      // 추가된 역할
      const addedRoles = newRoles.filter((newRole) =>
        roles.every((prevRole) => prevRole.id !== newRole.id)
      );

      // 삭제 작업
      await Promise.all(
        deletedRoles.map((role) =>
          groupRolesApi.deleteGroupRole({
            churchId,
            groupId: group.id as string,
            roleId: role.id,
          })
        )
      );

      // 수정 작업
      await Promise.all(
        updatedRoles.map((role) =>
          groupRolesApi.editGroupRole(
            { churchId, groupId: group.id as string, roleId: role.id },
            { role: role.role }
          )
        )
      );

      // 추가 작업
      await Promise.all(
        addedRoles.map((role) =>
          groupRolesApi.createSingleGroupRole(
            { churchId, groupId: group.id as string },
            { role: role.role }
          )
        )
      );

      // 상태 초기화 및 리렌더링
      fetchRoles();
      onClickClose();
      setNewRoles([]);
      setSelectedRole(DEFAULT_GROUP_ROLE);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (churchId && group) {
      fetchGroup();
      fetchRoles();
    }
  }, [churchId, group]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (newRoleRef.current) {
          if (getIsWellFormedName(newRoleName)) {
            onClickSaveNewRole();
          } else {
            newRoleRef.current.blur();
          }
        }
      } else if (e.key === 'Escape') {
        if (newRoleRef.current) {
          newRoleRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClickSaveNewRole]);

  const props = {
    newRoleRef,
    newName,
    newRoleName,
    roles: newRoles,
    selectedRoleId: selectedRole.id,
    setRoles: setNewRoles,
    setSelectedRole,
    onChangeName,
    onChangeNewRoleName,
    onClickSave,
    onClickSaveNewRole,
  };
  return (
    <>
      <EditGroupView {...props} />
    </>
  );
};

export default EditGroup;
