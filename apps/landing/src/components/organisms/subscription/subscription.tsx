import { useState } from 'react';
import SubscriptionView, {
  SubscriptionViewProps,
} from '@/components/organisms/subscription/subscription.view';
import {
  PAYMENT_CYCLE,
  SubscriptionPlan,
} from '@/models/subscription/subscription';
import { usePageRouter } from '@mokjang/app/src/utils/router';

const Subscription = () => {
  const router = usePageRouter();
  const [selectedCycle, setSelectedCycle] = useState<PAYMENT_CYCLE>(
    PAYMENT_CYCLE.MONTHLY
  );
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >();

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickCycle = (cycle: PAYMENT_CYCLE) => {
    setSelectedCycle(cycle);
  };

  const onClickPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    window.scrollTo({
      top: 300,
      behavior: 'smooth',
    });
  };

  const onClickProceed = () => {
    const random = new Date().getTime();

    if (random % 2 === 0) {
      router.push('/subscription/fail');
    } else {
      router.push('/subscription/complete');
    }
  };

  const props = {
    selectedCycle,
    selectedPlan,
    onClickCycle,
    onClickPlan,
    onClickProceed,
  } as SubscriptionViewProps;

  return (
    <>
      <SubscriptionView {...props} />
    </>
  );
};

export default Subscription;
