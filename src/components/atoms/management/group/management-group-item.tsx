import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchGroups } from '@/redux/reducers/church-reducer';

import { GroupsApi } from '@/api/management/group/groups.api';
import AddGroup from '@/components/atoms/management/group/add-group';
import { BLANK } from '@/constants/constant';
import ManagementGroupItemView from '@/components/atoms/management/group/management-group-item.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';

type ManagementGroupItemProps = {
  group: Group;
  level: number;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  closedGroups: Set<number>;
  onClickToggle: (id: string) => void;
};

const ManagementGroupItem = ({
  group,
  level,
  selectedGroupId,
  setSelectedGroup,
  closedGroups,
  onClickToggle,
}: ManagementGroupItemProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const dispatch = useDispatch<AppDispatch>();
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const isHaveChildren = group.childGroups && group.childGroups.length > 0;
  const isOpen = !closedGroups.has(parseInt(group.id as string));

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const nameInputRef = useRef<HTMLInputElement>(null);
  const newGroupRef = useRef<HTMLInputElement>(null);

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const [isAddShown, setIsAddShown] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(group.name);

  const onChangeNewGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewGroup = async () => {
    if (!getIsWellFormedTitle(newGroupName)) return;

    try {
      await groupsApi.createGroup(
        { churchId },
        { name: newGroupName, parentGroupId: group.id }
      );
      await dispatch(fetchGroups());
      setIsAddShown(false);
      setNewGroupName(BLANK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickGroup = async (groupId: string | null) => {
    if (!groupId) return;

    try {
      const response = await groupsApi.getGroup({ churchId, groupId });
      setSelectedGroup(response.data);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickGroupEdit = () => {
    setEditName(group.name);
    setIsEdit(true);
    setTimeout(() => nameInputRef.current?.focus());
  };

  const onClickGroupDelete = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmDelete = async (groupId: string) => {
    try {
      await groupsApi.deleteGroup({ churchId, groupId });
      await dispatch(fetchGroups());
      setSelectedGroup(DEFAULT_GROUP);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickGroupAdd = () => {
    setIsAddShown(true);
    setTimeout(() => newGroupRef.current?.focus());
  };

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onClickSaveName = async () => {
    if (editName === group.name || !getIsWellFormedTitle(editName)) {
      setIsEdit(false);
      return;
    }

    try {
      const response = await groupsApi.editGroup(
        { churchId, groupId: group.id as string },
        { name: editName }
      );
      await dispatch(fetchGroups());
      setSelectedGroup(response.data);
      setIsEdit(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onDropGroup = async (groupId: string, parentGroupId: string | null) => {
    if (groupId === parentGroupId) return;

    try {
      await groupsApi.editGroup({ churchId, groupId }, { parentGroupId });
      await dispatch(fetchGroups());
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
    newGroupRef.current?.addEventListener('blur', handleBlur);
    return () => newGroupRef.current?.removeEventListener('blur', handleBlur);
  }, [isAddShown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        if (nameInputRef.current === document.activeElement) {
          onClickSaveName();
        } else if (newGroupRef.current === document.activeElement) {
          onClickSaveNewGroup();
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editName, newGroupName]);

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
      <ConfirmPopup
        title={t_popup('deleteGroupTitle')}
        body={t_popup('deleteGroupBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(group.id as string)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
      <AddGroup
        ref={newGroupRef}
        isShown={isAddShown}
        level={level}
        name={newGroupName}
        onChangeName={onChangeNewGroupName}
        onClickSaveGroup={onClickSaveNewGroup}
      />
      {isOpen &&
        group.childGroups?.map((childGroup) => (
          <ManagementGroupItem
            key={childGroup.id}
            group={childGroup}
            level={level + 1}
            selectedGroupId={selectedGroupId}
            setSelectedGroup={setSelectedGroup}
            closedGroups={closedGroups}
            onClickToggle={onClickToggle}
          />
        ))}
    </>
  );
};

export default ManagementGroupItem;
