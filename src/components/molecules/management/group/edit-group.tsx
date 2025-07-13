import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import {
  DEFAULT_GROUP_ROLE,
  Group,
  GroupRole,
} from '@/models/management/management';
import { GroupRolesApi } from '@/api/management/group/group-roles.api';
import EditGroupView from '@/components/molecules/management/group/edit-group.view';
import { getFormattedTitle } from '@/utils/format';
import { GroupsApi } from '@/api/management/group/groups.api';
import { BLANK } from '@/constants/constant';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchGroups } from '@/redux/reducers/church-reducer';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { DESTRUCTIVE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../locales/client';

type EditGroupProps = {
  group: Group;
  roles: GroupRole[];
  onClickClose: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
  fetchRoles: () => void;
};

const EditGroup = ({
  group,
  roles,
  onClickClose,
  setIsToastShown,
  fetchRoles,
}: EditGroupProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t_popup = useScopedI18n('popup');
  const groupRolesApi = new GroupRolesApi(false);
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const newRoleRef = useRef<HTMLInputElement>(null);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

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
    setNewName(getFormattedTitle(event.target.value));
  };

  // 새 역할 이름 변경 시 이벤트
  const onChangeNewRoleName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewRoleName(getFormattedTitle(event.target.value));
  };

  // 새 역할 임시 저장
  const onClickSaveNewRole = () => {
    if (newRoles.every((r) => r.role !== newRoleName)) {
      setNewRoles([
        ...newRoles,
        {
          role: newRoleName,
          id: new Date().getTime().toString(),
          churchId: new Date().getTime().toString(),
          groupId: new Date().getTime().toString(),
        },
      ]);
      setNewRoleName(BLANK);
    } else {
      setIsPopupShown(true);
    }
  };

  // 저장하기
  const onClickSave = async () => {
    try {
      // 이름 변경
      if (group.name !== newName) {
        await groupsApi.editGroupName(
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
      dispatch(fetchGroups());
      fetchRoles();
      onClickClose();
      setNewRoles([]);
      setSelectedRole(DEFAULT_GROUP_ROLE);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) {
        return;
      }

      if (e.key === 'Enter') {
        if (newRoleRef.current) {
          if (getIsWellFormedTitle(newRoleName)) {
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
      {isPopupShown && (
        <ToastPopup
          text={t_popup('duplicatedRole')}
          setIsShow={setIsPopupShown}
          backgroundColor={DESTRUCTIVE.DEFAULT}
        />
      )}
    </>
  );
};

export default EditGroup;
