'use client';

import HeroView, {
  HeroViewProps,
} from '@/components/molecules/main/hero/hero.view';
import { usePageRouter } from '../../../../../../../packages/utils/src';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { routeAppPage } from '@mokjang/utils';

const Hero = () => {
  const router = usePageRouter();

  const { subscription } = useSelector(
    (state: RootState) => state.subscription
  );

  const onClickCreateChurch = () => {
    if (subscription?.currentPlan) {
      routeAppPage('/church/register');
    } else {
      router.push('/subscription');
    }
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
