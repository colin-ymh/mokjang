import styled from 'styled-components';
import React, { useState } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import {
  DEFAULT_GROUP,
  Officer,
} from '../../../../../models/management/management';
import { fetchOfficers } from '../../../../../redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '../../../../../constants/styles/color';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { OfficersApi } from '../../../../../api/management/officer/officers.api';
import EditOfficerView from './edit-officer.view';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

type EditOfficerProps = {
  editName: string;
  onChangeEditOfficerName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedOfficer: Officer;
  onClickOfficer: (officer: Officer) => void;
  onClickClose: () => void;
};

const EditOfficer = ({
  editName,
  onChangeEditOfficerName,
  selectedOfficer,
  onClickOfficer,
  onClickClose,
}: EditOfficerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_warning = useScopedI18n('warning');

  const officersApi = new OfficersApi(false);

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
      await officersApi
        .deleteOfficer({
          churchId,
          officerId: selectedOfficer.id as string,
        })
        .then(() => {
          onClickOfficer(DEFAULT_GROUP);
        });

      await dispatch(fetchOfficers());

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
    editName,
    onChangeEditOfficerName,
    selectedOfficer,
    isDeleteShown,
    onClickDeleteOpen,
    onClickDeleteClose,
    onClickDelete,
  };

  return (
    <>
      <EditOfficerView {...props} />
    </>
  );
};

export default EditOfficer;
