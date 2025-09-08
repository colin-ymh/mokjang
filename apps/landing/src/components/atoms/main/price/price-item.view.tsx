import styled from 'styled-components';
import {
  BLACK,
  GRAY,
  GREEN,
  LOCALE,
  MAIN,
  WHITE,
} from '../../../../../../../packages/constants/src';
import React from 'react';
import {
  Button,
  MainText,
  SvgIcon,
} from '../../../../../../../packages/components/src';
import { Plan } from '@mokjang/models';
import { useScopedI18n } from '../../../../../locales/client';
import { usePathname } from 'next/navigation';

import { getTranslatedMemberCount } from '../../../../../../../packages/utils/src';
import { getTranslatedMonthlySubscriptionPriceComponent } from '@/hooks/translate/translate';
import { getTranslatedMaxRegisterMember } from '@mokjang/utils';

import { Svg } from '@mokjang/assets';

const ItemContainer = styled.div<{ $isHover?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${WHITE};
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  height: 500px;
  overflow: hidden;
  gap: 30px;

  border: 2px solid ${WHITE};
  transform-origin: center;
  will-change: transform;
  backface-visibility: hidden;
  transition:
    border 0.2s,
    transform 0.2s;
  &:hover {
    border: 2px solid ${MAIN.DEFAULT};
    transform: scale(1.05) translateZ(0);
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 30px;
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

export type PriceItemViewProps = {
  item: Plan;
  isHover: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const PriceItemView = ({
  item,
  isHover,
  onMouseEnter,
  onMouseLeave,
}: PriceItemViewProps) => {
  const { id, min, max, price, functions } = item;
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t_button = useScopedI18n('button');
  const t_subscription = useScopedI18n('subscription');
  const t_function = useScopedI18n('subscription.function');

  return (
    <ItemContainer onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Header>
        <MainText fontSize={20} fontWeight={700}>
          {t_subscription(id)}
        </MainText>
        <MainText color={GRAY.SEMI_DARK}>
          {`${getTranslatedMemberCount(locale, min)} - ${getTranslatedMemberCount(locale, max)}`}
        </MainText>
        {getTranslatedMonthlySubscriptionPriceComponent(locale, price)}
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
      <Button
        text={t_button('select')}
        fontWeight={600}
        color={isHover ? WHITE : BLACK}
        backgroundColor={isHover ? MAIN.DEFAULT : GRAY.LIGHT}
        width={180}
        height={50}
      />
    </ItemContainer>
  );
};

export default PriceItemView;
