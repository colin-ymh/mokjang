import React, { useState } from 'react';
import { Ministry } from '@/models/management/management';
import EditMinistryView from '@/components/atoms/management/ministry/edit/edit-ministry.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useScopedI18n } from '../../../../../../locales/client';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';

type EditMinistryProps = {
  editName: string;
  ministries: Ministry[];
  onChangeEditMinistryName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  selectedMinistry?: Ministry;
  fetchMinistries?: () => void;
  onClickClose?: () => void;
};

const EditMinistry = ({
  editName,
  ministries,
  onChangeEditMinistryName,
  selectedMinistry,
  fetchMinistries,
  onClickClose,
}: EditMinistryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const t_popup = useScopedI18n('popup');

  const ministriesApi = new MinistriesApi(false);

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
    if (!selectedMinistry) return;
    try {
      await ministriesApi.deleteMinistry({
        churchId,
        ministryId: selectedMinistry.id as string,
      });

      fetchMinistries && fetchMinistries();

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
      onClickClose && onClickClose();
    }
  };

  const props = {
    editName,
    ministries,
    onChangeEditMinistryName,
    isDeleteShown,
    onClickDeleteOpen,
    onClickDeleteClose,
    onClickDelete,
    selectedMinistry,
  };

  return (
    <>
      <EditMinistryView {...props} />
    </>
  );
};

export default EditMinistry;
