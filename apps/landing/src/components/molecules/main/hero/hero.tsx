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

  const { currentSubscription } = useSelector(
    (state: RootState) => state.subscription
  );

  const onClickCreateChurch = () => {
    if (currentSubscription?.currentPlan) {
      routeAppPage('/church/register');
    } else {
      router.push('/subscription');
    }
  };

  const onClickJoin = () => {
    router.push('/join');
  };

  const props = {
    onClickCreateChurch,
    onClickJoin,
  } as HeroViewProps;

  return (
    <>
      <HeroView {...props} />
    </>
  );
};

export default Hero;
