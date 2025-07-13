import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { GroupsApi } from '@/api/management/group/groups.api';
import GroupManagementView from '@/components/organisms/management/group/group-management.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getFormattedTitle } from '@/utils/format';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchGroups } from '@/redux/reducers/church-reducer';
import { BLANK } from '@/constants/constant';
import { BLACK } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../locales/client';

type GroupManagementProps = {};

const GroupManagement = ({}: GroupManagementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t_popup = useScopedI18n('popup');
  const { churchId, groups } = useSelector((state: RootState) => state.church);

  const groupsApi = new GroupsApi(false);

  // 새로 추가할 그룹명
  const [newGroupName, setNewGroupName] = useState<string>(BLANK);

  // 수정할 그룹명
  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(BLANK);

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 에러 처리
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickEditOpen = () => {
    setIsEditShown(true);
  };

  const onClickEditClose = () => {
    setIsEditShown(false);
  };

  const onChangeNewGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(getFormattedTitle(event.target.value));
  };

  const onChangeEditGroupName = (event: ChangeEvent<HTMLInputElement>) => {
    setEditName(getFormattedTitle(event.target.value));
  };

  const onClickSaveEdit = async () => {
    if (!getIsWellFormedTitle(editName)) {
      return;
    }

    try {
      const response = await groupsApi.editGroupName(
        { churchId, groupId: selectedGroup.id as string },
        { name: editName }
      );
      await dispatch(fetchGroups());
      setSelectedGroup(response.data);
      setIsEditShown(false);
      setEditName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickSaveNewGroup = async () => {
    if (!getIsWellFormedTitle(newGroupName)) return;

    try {
      await groupsApi.createGroup({ churchId }, { name: newGroupName });
      await dispatch(fetchGroups());
      setNewGroupName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 그룹 불러오기
  const fetchGroup = async () => {
    try {
      if (selectedGroup.id) {
        await groupsApi
          .getGroup({ churchId, groupId: selectedGroup.id })
          .then((response) => {
            setSelectedGroup(response.data);
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (groups && selectedGroup.id !== null) {
      fetchGroup();
    }
  }, [groups]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        onClickSaveNewGroup();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newGroupName]);

  const props = {
    newGroupName,
    isEditShown,
    editName,
    onChangeEditGroupName,
    onClickEditOpen,
    onClickEditClose,
    onClickSaveEdit,
    onChangeNewGroupName,
    onClickSaveNewGroup,
    selectedGroup,
    setSelectedGroup,
    isToastShown,
    toastText,
    toastColor,
    setIsToastShown,
  };

  return (
    <>
      <GroupManagementView {...props} />
    </>
  );
};

export default GroupManagement;
