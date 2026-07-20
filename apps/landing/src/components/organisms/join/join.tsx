import { ChangeEvent, useEffect, useState } from 'react';
import { BLACK, BLANK, DESTRUCTIVE, STATUS } from '@mokjang/constants';
import { JoinApi } from '@/api/join/join.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import JoinView, { JoinViewProps } from '@/components/organisms/join/join.view';
import { Church, DEFAULT_CHURCH } from '@mokjang/models';
import JoinPendingView from '@/components/organisms/join/join-pending.view';
import { usePageRouter } from '@mokjang/utils';
import { useScopedI18n } from '../../../../locales/client';

const Join = () => {
  const t_popup = useScopedI18n('popup');
  const router = usePageRouter();
  const dispatch = useDispatch<AppDispatch>();
  const joinApi = new JoinApi(false);

  const [isPending, setIsPending] = useState(false);
  const [joinCode, setJoinCode] = useState(BLANK);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [church, setChurch] = useState<Church>(DEFAULT_CHURCH);

  // ✅ fetchJoinRequest 완료 전 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onChangeJoinCode = (event: ChangeEvent<HTMLInputElement>) => {
    setJoinCode(event.target.value);
  };

  const onClickCodeConfirm = async () => {
    try {
      const response = await joinApi.searchChurch({ joinCode });
      setChurch(response.data.data);
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
    try {
      await joinApi.createJoinRequest({ joinCode });
      setIsConfirmed(true);
      fetchJoinRequest();
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
    } finally {
      // ✅ fetchJoinRequest 완료 시 로딩 종료
      setIsLoading(false);
    }
  };

  const onClickCancelRequest = async () => {
    try {
      await joinApi.cancelJoinRequest();
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

  const props: JoinViewProps = {
    joinCode,
    isConfirmed,
    isChecked,
    church,
    onChangeJoinCode,
    onClickCodeConfirm,
    onClickChurchChecked,
    onClickJoinRequest,
  };

  // ✅ fetchJoinRequest 끝나기 전에는 아무 것도 렌더링하지 않음
  if (isLoading) return null; // 필요 시 스켈레톤/로딩 스피너로 교체 가능

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
