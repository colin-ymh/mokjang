import { useState } from 'react';
import EditChurchInformation from '@/components/molecules/management/church/edit-church-information';
import { setChurch } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/constants';
import { useScopedI18n } from '../../../../locales/client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ChurchesApi } from '@/api/churches/churches.api';
import { Church, DEFAULT_CHURCH } from '@mokjang/models';

const ChurchRegisterList = () => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const [targetChurch, setTargetChurch] = useState<Church>(DEFAULT_CHURCH);
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();

  const churchesApi = new ChurchesApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickSave = async () => {
    try {
      const response = await churchesApi.createChurch({
        phone: targetChurch.phone,
        address: targetChurch.address,
        detailAddress: targetChurch.detailAddress,
        name: targetChurch.name,
        pastor: targetChurch.pastor,
        identifyNumber: targetChurch.identifyNumber,
        denomination: targetChurch.denomination,
      });

      const editedChurch = response.data;
      dispatch(setChurch(editedChurch));

      // dispatch(setToastText(t_popup('saveComplete')));
      // dispatch(setIsToastShown(true));
      // dispatch(setToastBackgroundColor(BLACK));
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

  return (
    <>
      <EditChurchInformation
        targetChurch={targetChurch}
        setTargetChurch={setTargetChurch}
        onClickSave={onClickSave}
      />
    </>
  );
};

export default ChurchRegisterList;
