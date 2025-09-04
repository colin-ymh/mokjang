import React, { useEffect, useState } from 'react';
import { Church, DEFAULT_CHURCH } from '@mokjang/models';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { ChurchesApi } from '../../../../api/churches/churches.api';
import { BLACK, DESTRUCTIVE } from '@mokjang/constants';
import { useScopedI18n } from '../../../../../locales/client';
import { setChurch } from '../../../../redux/reducers/church-reducer';
import ChurchManagementView from './church-management.view';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../redux/reducers/toast-popup-reducer';

const ChurchManagement = () => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();

  const churchesApi = new ChurchesApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const { church, churchId } = useSelector((state: RootState) => state.church);

  const [targetChurch, setTargetChurch] = useState<Church>(DEFAULT_CHURCH);

  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const onClickEditOpen = () => {
    setIsEditShown(true);
  };

  const onClickEditClose = () => {
    setIsEditShown(false);
  };

  const onClickEditSave = async () => {
    try {
      const response = await churchesApi.editChurch(
        { churchId },
        {
          phone: targetChurch.phone,
          address: targetChurch.address,
          detailAddress: targetChurch.detailAddress,
          name: targetChurch.name,
          pastor: targetChurch.pastor,
          identifyNumber: targetChurch.identifyNumber,
          denomination: targetChurch.denomination,
        }
      );

      const editedChurch = response.data;
      dispatch(setChurch(editedChurch));

      setIsEditShown(false);
      dispatch(setToastText(t_popup('saveComplete')));
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
    }
  };

  useEffect(() => {
    setTargetChurch(church);
  }, [church]);

  const props = {
    targetChurch,
    setTargetChurch,
    isEditShown,
    onClickEditOpen,
    onClickEditClose,
    onClickEditSave,
  };

  return (
    <>
      <ChurchManagementView {...props} />
    </>
  );
};

export default ChurchManagement;
