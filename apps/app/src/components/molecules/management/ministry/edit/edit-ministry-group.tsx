import React, { useState } from 'react';
import { useScopedI18n } from '../../../../../../locales/client';
import { DEFAULT_MINISTRY_GROUP, Member, MinistryGroup } from '@mokjang/models';
import { fetchMinistryGroups } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import EditMinistryGroupView from './edit-ministry-group.view';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';

type EditMinistryGroupProps = {
  members: Member[];
  editName: string;
  onChangeEditMinistryGroupName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onChangeNewMinistryGroupLeaderId: (id: string) => void;
  selectedMinistryGroup: MinistryGroup;
  onClickMinistryGroup: (group: MinistryGroup) => void;
  onClickClose: () => void;
};

const EditMinistryGroup = ({
  members,
  editName,
  onChangeEditMinistryGroupName,
  onChangeNewMinistryGroupLeaderId,
  selectedMinistryGroup,
  onClickMinistryGroup,
  onClickClose,
}: EditMinistryGroupProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const t_popup = useScopedI18n('popup');

  const groupsApi = new MinistryGroupsApi(false);

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
        .deleteMinistryGroup({
          churchId,
          ministryGroupId: selectedMinistryGroup.id as string,
        })
        .then(() => {
          onClickMinistryGroup(DEFAULT_MINISTRY_GROUP);
        });

      await dispatch(fetchMinistryGroups());

      dispatch(setToastText(t_popup('deleteComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
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
    onChangeEditMinistryGroupName,
    onChangeNewMinistryGroupLeaderId,
    selectedMinistryGroup,
    onClickDeleteOpen,
    isDeleteShown,
    onClickDeleteClose,
    onClickDelete,
  };
  return (
    <>
      <EditMinistryGroupView {...props} />
    </>
  );
};

export default EditMinistryGroup;
