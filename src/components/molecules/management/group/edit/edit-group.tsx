import React, { useState } from 'react';
import { useScopedI18n } from '../../../../../../locales/client';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { fetchGroups } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { GroupsApi } from '@/api/management/group/groups.api';
import EditGroupView from '@/components/molecules/management/group/edit/edit-group.view';
import { Member } from '@/models/member/member';

type EditGroupProps = {
  members: Member[];
  editName: string;
  onChangeEditGroupName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeNewGroupLeaderId: (id: string) => void;
  selectedGroup: Group;
  onClickGroup: (group: Group) => void;
  onClickClose: () => void;
};

const EditGroup = ({
  members,
  editName,
  onChangeEditGroupName,
  onChangeNewGroupLeaderId,
  selectedGroup,
  onClickGroup,
  onClickClose,
}: EditGroupProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const t_popup = useScopedI18n('popup');

  const groupsApi = new GroupsApi(false);

  // 에러 처리
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isDeleteShown, setIsDeleteShown] = useState<boolean>(false);

  const onClickDeleteOpen = () => {
    setIsDeleteShown(true);
  };

  const onClickDeleteClose = () => {
    setIsDeleteShown(false);
  };

  const onClickDelete = async () => {
    try {
      await groupsApi
        .deleteGroup({
          churchId,
          groupId: selectedGroup.id as string,
        })
        .then(() => {
          onClickGroup(DEFAULT_GROUP);
        });

      await dispatch(fetchGroups());

      dispatch(setToastText(t_popup('deleteComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.LIGHT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsDeleteShown(false);
      onClickClose();
    }
  };

  const props = {
    members,
    editName,
    onChangeEditGroupName,
    onChangeNewGroupLeaderId,
    selectedGroup,
    onClickDeleteOpen,
    isDeleteShown,
    onClickDeleteClose,
    onClickDelete,
  };
  return (
    <>
      <EditGroupView {...props} />
    </>
  );
};

export default EditGroup;
