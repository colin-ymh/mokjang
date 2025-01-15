import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_GROUP_ROLE,
  Group,
  GroupRole,
} from '@/models/management/management';
import { GroupRolesApi } from '@/api/management/group/group-roles.api';
import EditGroupView from '@/components/molecules/management/group/edit-group.view';
import { BLANK } from '@/constants/constant';
import { getFormattedName } from '@/utils/format';
import { GroupsApi } from '@/api/management/group/groups.api';

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

  // 변경될 이름
  const [newName, setNewName] = useState<string>(BLANK);

  // 선택된 역할
  const [selectedRole, setSelectedRole] =
    useState<GroupRole>(DEFAULT_GROUP_ROLE);

  // 임시 역할 배열
  const [newRoles, setNewRoles] = useState<GroupRole[]>(roles);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewName(getFormattedName(event.target.value));
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

      // 역할 변경
      await Promise.all(
        newRoles
          .filter((newRole) =>
            roles.every((prevRole) => prevRole.id !== newRole.id)
          )
          .map((role) => {
            groupRolesApi.createSingleGroupRole(
              { churchId, groupId: group.id as string },
              { role: role.role }
            );
          })
      );

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

  const props = {
    newName,
    roles: newRoles,
    selectedRoleId: selectedRole.id,
    setRoles: setNewRoles,
    setSelectedRole,
    onChangeName,
    onClickSave,
  };
  return (
    <>
      <EditGroupView {...props} />
    </>
  );
};

export default EditGroup;
