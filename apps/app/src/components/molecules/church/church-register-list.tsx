import { useState } from 'react';
import EditChurchInformation from '@/components/molecules/management/church/edit-church-information';
import { setChurch, setChurchId } from '@/redux/reducers/church-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { ChurchesApi } from '@/api/churches/churches.api';
import { Church, DEFAULT_CHURCH } from '@mokjang/models';
import { usePageRouter } from '@mokjang/utils';
import { Loading } from '@mokjang/components';
import { SubscriptionApi } from '@/api/subscription/subscription.api';

const ChurchRegisterList = () => {
  const router = usePageRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [targetChurch, setTargetChurch] = useState<Church>(DEFAULT_CHURCH);
  const dispatch = useDispatch<AppDispatch>();

  const churchesApi = new ChurchesApi(false);
  const subscriptionApi = new SubscriptionApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickSave = async () => {
    setIsLoading(true);

    // 구독 정보 확인
    try {
      await subscriptionApi.getCurrentSubscription();

      // 구독 정보가 있으면, 메인으로
      // router.push('/main');
    } catch (error) {
      //  없으면 구독
      await subscriptionApi.getFreeTrial();
    }

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
      dispatch(setChurchId(editedChurch.id));

      // dispatch(setToastText(t_popup('saveComplete')));
      // dispatch(setIsToastShown(true));
      // dispatch(setToastBackgroundColor(BLACK));

      router.push('/church/init');
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EditChurchInformation
        targetChurch={targetChurch}
        setTargetChurch={setTargetChurch}
        onClickSave={onClickSave}
      />
      <Loading isShow={isLoading} />
    </>
  );
};

export default ChurchRegisterList;
