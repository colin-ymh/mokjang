import styled from 'styled-components';
import { GRAY, GREEN, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import React from 'react';
import {
  MainText,
  RadioButton,
  SvgIcon,
} from '../../../../../../packages/components/src';
import { BILLING_CYCLE, Plan } from '@mokjang/models';
import { useScopedI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';

import { getTranslatedMemberCount } from '../../../../../../packages/utils/src';
import { getTranslatedMaxRegisterMember } from '@/utils/translate';

import { Svg } from '@mokjang/assets';
import {
  getTranslatedMonthlySubscriptionPriceComponent,
  getTranslatedYearlySubscriptionPriceComponent,
} from '@/hooks/translate/translate';
import { getYearlyPrice } from '@/utils/price';

const ItemContainer = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${WHITE};
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  padding: 30px 0;
  overflow: hidden;
  gap: 30px;

  border: ${({ $isSelected }) =>
    `2px solid ${$isSelected ? MAIN.DEFAULT : WHITE}`};
  transition: border 0.2s;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const FunctionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const FunctionItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  margin-left: 40px;
`;

export type SubscriptionItemViewProps = {
  item: Plan;
  isSelected: boolean;
  onClick: (plan: Plan) => void;
  cycle: BILLING_CYCLE;
};

const SubscriptionItemView = ({
  item,
  isSelected,
  onClick,
  cycle,
}: SubscriptionItemViewProps) => {
  const { id, min, max, price, functions } = item;
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t_button = useScopedI18n('button');
  const t_subscription = useScopedI18n('subscription');
  const t_function = useScopedI18n('subscription.function');

  return (
    <ItemContainer onClick={() => onClick(item)} $isSelected={isSelected}>
      <Header>
        <MainText fontSize={20} fontWeight={700}>
          {t_subscription(id)}
        </MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {`${getTranslatedMemberCount(locale, min)} - ${getTranslatedMemberCount(locale, max)}`}
        </MainText>
        <MainText fontSize={24} fontWeight={700}>
          {cycle === BILLING_CYCLE.MONTHLY
            ? getTranslatedMonthlySubscriptionPriceComponent(locale, price)
            : getTranslatedYearlySubscriptionPriceComponent(
                locale,
                getYearlyPrice(price)
              )}
        </MainText>
        <MainText color={GRAY.DARK}>
          {getTranslatedMaxRegisterMember(locale, max)}
        </MainText>
      </Header>
      <FunctionList>
        {functions.map((item) => (
          <FunctionItem key={item}>
            <SvgIcon
              svg={Svg.Check}
              color={GREEN.DEFAULT}
              size={16}
              width={2}
            />
            <MainText color={GRAY.DARK}>{t_function(item)}</MainText>
          </FunctionItem>
        ))}
      </FunctionList>
      <RadioButton isSelected={isSelected} isBorder={false} />
    </ItemContainer>
  );
};

export default SubscriptionItemView;
