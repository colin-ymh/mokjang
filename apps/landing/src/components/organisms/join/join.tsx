import { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, BLANK } from '../../../../../../packages/constants/src';
import { JoinApi } from '@/api/join/join.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@mokjang/app/src/redux/reducers/toast-popup-reducer';
import { DESTRUCTIVE } from '@mokjang/app/src/constants/styles/color';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import JoinView, { JoinViewProps } from '@/components/organisms/join/join.view';
import { Church, DEFAULT_CHURCH } from '@/models/church/church';
import { STATUS } from '@mokjang/app/src/constants/status/status';
import JoinPendingView from '@/components/organisms/join/join-pending.view';
import { usePageRouter } from '@mokjang/app/src/utils/router';
import { useScopedI18n } from '../../../../locales/client';

const Join = () => {
  const t_popup = useScopedI18n('popup');
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();
  const joinApi = new JoinApi(false);

  const [isPending, setIsPending] = useState<boolean>(false);

  const [joinCode, setJoinCode] = useState<string>(BLANK);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [church, setChurch] = useState<Church>(DEFAULT_CHURCH);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onChangeJoinCode = (event: ChangeEvent<HTMLInputElement>) => {
    setJoinCode(event.target.value);
  };

  const onClickCodeConfirm = async () => {
    try {
      const response = await joinApi.createJoinRequest({ joinCode });

      const newChurch = response.data.data.church;

      setChurch(newChurch);

      setIsConfirmed(true);
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

  const onClickChurchChecked = () => {
    setIsChecked(true);
  };

  const onClickJoinRequest = async () => {
    fetchJoinRequest();
    // try {
    //   const response = await joinApi.createJoinRequest({ joinCode });
    //   setIsConfirmed(true);
    // } catch (error) {
    //   if (error instanceof Error) {
    //     dispatch(setToastText(error.message));
    //     dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
    //     dispatch(setIsToastShown(true));
    //   } else {
    //     setThrownError(new Error(String(error)));
    //   }
    // }
  };

  const fetchJoinRequest = async () => {
    try {
      const response = await joinApi.getJoinRequests();

      const requests = response.data;

      if (requests && requests.length > 0) {
        const lastRequest = requests[0];
        if (lastRequest?.status === STATUS.PENDING) {
          setIsPending(true);
          setChurch(lastRequest.church as Church);
        }
      }
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

  const onClickCancelRequest = async () => {
    try {
      const response = await joinApi.cancelJoinRequest();
      dispatch(setToastText(t_popup('cancelComplete')));
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setIsToastShown(true));
      router.push('/');
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

  const onClickBackToHome = () => {
    router.push('/');
  };

  useEffect(() => {
    fetchJoinRequest();
  }, []);

  const props = {
    joinCode,
    isConfirmed,
    isChecked,
    church,
    onChangeJoinCode,
    onClickCodeConfirm,
    onClickChurchChecked,
    onClickJoinRequest,
  } as JoinViewProps;

  return (
    <>
      {isPending ? (
        <JoinPendingView
          church={church}
          onClickCancelRequest={onClickCancelRequest}
          onClickBackToHome={onClickBackToHome}
        />
      ) : (
        <JoinView {...props} />
      )}
    </>
  );
};

export default Join;
