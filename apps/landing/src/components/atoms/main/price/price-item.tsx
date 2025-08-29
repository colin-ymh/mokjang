import React, { useState } from 'react';
import { SubscriptionPlan } from '@/models/subscription/subscription';
import PriceItemView, {
  PriceItemViewProps,
} from '@/components/atoms/main/price/price-item.view';

type PriceItemProps = {
  item: SubscriptionPlan;
};

const PriceItem = ({ item }: PriceItemProps) => {
  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => setIsHover(true);
  const onMouseLeave = () => setIsHover(false);

  const props = {
    item,
    isHover,
    onMouseEnter,
    onMouseLeave,
  } as PriceItemViewProps;
  return (
    <>
      <PriceItemView {...props} />
    </>
  );
};

export default PriceItem;
