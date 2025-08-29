import React from 'react';
import {
  PAYMENT_CYCLE,
  SubscriptionPlan,
} from '@/models/subscription/subscription';
import SubscriptionItemView, {
  SubscriptionItemViewProps,
} from '@/components/atoms/subscription/subscription-item.view';

type SubscriptionItemProps = {
  item: SubscriptionPlan;
  isSelected: boolean;
  onClick: (plan: SubscriptionPlan) => void;
  cycle: PAYMENT_CYCLE;
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
