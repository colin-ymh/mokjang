import React, { useEffect, useState } from 'react';
import { Church, DEFAULT_CHURCH } from '@/models/church/church';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ChurchesApi } from '@/api/churches/churches.api';
import { BLANK } from '@/constants/constant';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../../locales/client';
import { setChurch } from '@/redux/reducers/church-reducer';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import ChurchManagementView from '@/components/organisms/management/church/church-management.view';

const ChurchManagement = () => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();

  const churchesApi = new ChurchesApi(false);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>(BLANK);
  const [toastColor, setToastColor] = useState<string>(BLACK);
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
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
        setToastColor(DESTRUCTIVE.LIGHT);
        setIsToastShown(true);
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
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={toastColor}
        />
      )}
    </>
  );
};

export default ChurchManagement;
