import SubscriptionFailView, {
  SubscriptionFailViewProps,
} from '@/components/organisms/subscription/subscription-fail.view';
import { usePageRouter } from '@mokjang/utils';

const SubscriptionFail = () => {
  const router = usePageRouter();

  const onClickRetry = () => {
    const random = new Date().getTime();

    if (random % 2 === 0) {
      router.push('/subscription/fail');
    } else {
      router.push('/subscription/complete');
    }
  };

  const props = {
    onClickRetry,
  } as SubscriptionFailViewProps;
  return (
    <>
      <SubscriptionFailView {...props} />
    </>
  );
};

export default SubscriptionFail;
