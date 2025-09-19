'use client';

import HeroView, {
  HeroViewProps,
} from '@/components/molecules/main/hero/hero.view';
import { usePageRouter } from '../../../../../../../packages/utils/src';
import { routeAppPage } from '@mokjang/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { JoinApi } from '@/api/join/join.api';
import { DESTRUCTIVE, STATUS } from '@mokjang/constants';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@mokjang/app/src/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const joinApi = new JoinApi(false);
  const t_popup = useScopedI18n('popup');

  const router = usePageRouter();

  const onClickOpenChurch = () => {
    routeAppPage('/main');
  };

  const onClickCreateChurch = async () => {
    const response = await joinApi.getJoinRequests();

    const requests = response.data;

    if (requests && requests.length > 0) {
      const lastRequest = requests[0];
      if (lastRequest?.status === STATUS.PENDING) {
        dispatch(setToastText(t_popup('joinRequestExist')));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        return;
      }
    }

    routeAppPage('/church/register');
  };

  const onClickJoin = () => {
    router.push('/join');
  };

  const onClickStart = () => {
    router.push('/login');
  };

  const onClickDonate = () => {
    router.push('/donate');
  };

  const props = {
    onClickOpenChurch,
    onClickCreateChurch,
    onClickJoin,
    onClickStart,
    onClickDonate,
  } as HeroViewProps;

  return (
    <>
      <HeroView {...props} />
    </>
  );
};

export default Hero;
