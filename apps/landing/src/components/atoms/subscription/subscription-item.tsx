import React from 'react';
import { BILLING_CYCLE, Plan } from '@mokjang/models';
import SubscriptionItemView, {
  SubscriptionItemViewProps,
} from '@/components/atoms/subscription/subscription-item.view';

type SubscriptionItemProps = {
  item: Plan;
  isSelected: boolean;
  onClick: (plan: Plan) => void;
  cycle: BILLING_CYCLE;
};

const SubscriptionItem = ({
  item,
  isSelected,
  onClick,
  cycle,
}: SubscriptionItemProps) => {
  const props = {
    item,
    isSelected,
    onClick,
    cycle,
  } as SubscriptionItemViewProps;
  return (
    <>
      <SubscriptionItemView {...props} />
    </>
  );
};

export default SubscriptionItem;
