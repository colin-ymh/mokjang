import styled from 'styled-components';
import { GRAY, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import {
  Button,
  MainText,
  SvgIcon,
  ToggleRadioButton,
} from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';
import { BILLING_CYCLE, Plan, PlanList } from '@mokjang/models';
import SubscriptionItem from '@/components/atoms/subscription/subscription-item';
import { getYearlyPrice } from '@/utils/price';
import {
  getTranslatedMaxRegisterMember,
  getTranslatedMonthlySubscriptionPrice,
  getTranslatedYearlySubscriptionPrice,
} from '@mokjang/utils';

import { Svg } from '@mokjang/assets';

const JoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 1000px;
  padding: 100px;
  gap: 50px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const ToggleContainer = styled.div`
  display: flex;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const SubscriptionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;

const PaymentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;

  border-radius: 10px;
  background-color: ${WHITE};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PaymentWrapper = styled.div`
  display: flex;
  padding: 30px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  border-radius: 10px;
  background-color: ${MAIN.EXTRA_LIGHT};
  width: 100%;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export type SubscriptionViewProps = {
  selectedCycle: BILLING_CYCLE;
  selectedPlan: Plan;
  onClickCycle: (cycle: BILLING_CYCLE) => void;
  onClickPlan: (plan: Plan) => void;
  onClickProceed: () => void;
};

const SubscriptionView = ({
  selectedCycle,
  selectedPlan,
  onClickCycle,
  onClickPlan,
  onClickProceed,
}: SubscriptionViewProps) => {
  const pathname = usePathname();

  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_subscription = useScopedI18n('subscription');
  const t_cycle = useScopedI18n('subscription.cycle');
  const t_payment = useScopedI18n('payment');

  const cycleItems = Object.values(BILLING_CYCLE).map((item) => {
    return {
      value: item,
      title: t_cycle(item),
    };
  });

  return (
    <>
      <JoinContainer>
        <HeaderContainer>
          <MainText fontSize={30} fontWeight={700}>
            {t_subscription('title')}
          </MainText>
          <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
            {t_subscription('description')}
          </MainText>
        </HeaderContainer>
        <ContentContainer>
          <ToggleContainer>
            <ToggleRadioButton
              items={cycleItems}
              selectedValue={selectedCycle}
              onChange={onClickCycle}
              rowPadding={20}
              columnPadding={10}
              fontSize={16}
              fontWeight={400}
              toggleBackgroundColor={MAIN.DEFAULT}
              backgroundColor={WHITE}
              color={WHITE}
            />
          </ToggleContainer>
          <SubscriptionList>
            {PlanList.map((item) => (
              <SubscriptionItem
                key={item.id}
                item={item}
                isSelected={item.id === selectedPlan?.id}
                onClick={onClickPlan}
                cycle={selectedCycle}
              />
            ))}
          </SubscriptionList>
          {selectedPlan && (
            <PaymentContainer>
              <PaymentWrapper>
                <MainText fontSize={30} fontWeight={700}>
                  {t_payment('title')}
                </MainText>
                <CardContainer>
                  <MainText fontSize={20} fontWeight={600}>
                    {t_payment('selectedPlan')}
                  </MainText>
                  <MainText color={MAIN.DEFAULT} fontSize={24} fontWeight={700}>
                    {t_subscription(selectedPlan.id)}
                  </MainText>
                  <MainText fontSize={30} fontWeight={700} color={MAIN.DEFAULT}>
                    {selectedCycle === BILLING_CYCLE.MONTHLY
                      ? getTranslatedMonthlySubscriptionPrice(
                          locale,
                          selectedPlan.price
                        )
                      : getTranslatedYearlySubscriptionPrice(
                          locale,
                          getYearlyPrice(selectedPlan.price)
                        )}
                  </MainText>
                  <MainText color={GRAY.DARK} fontSize={16} fontWeight={400}>
                    {getTranslatedMaxRegisterMember(locale, selectedPlan.max)}
                  </MainText>
                </CardContainer>
                <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
                  {t_payment('description')}
                </MainText>
                <Button
                  text={t_payment('paymentContinue')}
                  fontSize={20}
                  fontWeight={700}
                  width={300}
                  height={60}
                  gap={10}
                  borderRadius={10}
                  onClick={onClickProceed}
                  icon={
                    <SvgIcon
                      svg={Svg.CreditCard}
                      color={WHITE}
                      width={2}
                      size={20}
                    />
                  }
                />
                <RowContainer>
                  <SvgIcon
                    svg={Svg.ShieldCheck}
                    color={GRAY.SEMI_DARK}
                    width={2}
                    size={20}
                  />
                  <MainText color={GRAY.SEMI_DARK}>{t_payment('ssl')}</MainText>
                </RowContainer>
              </PaymentWrapper>
            </PaymentContainer>
          )}
        </ContentContainer>
      </JoinContainer>
    </>
  );
};

export default SubscriptionView;
