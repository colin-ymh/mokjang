import SubscriptionCompleteView, {
  SubscriptionCompleteViewProps,
} from '@/components/organisms/subscription/subscription-complete.view';
import { usePageRouter } from '@mokjang/utils';

const SubscriptionComplete = () => {
  const router = usePageRouter();

  const onClickStart = () => {
    router.push('/');
  };

  const props = {
    onClickStart,
  } as SubscriptionCompleteViewProps;
  return (
    <>
      <SubscriptionCompleteView {...props} />
    </>
  );
};

export default SubscriptionComplete;
