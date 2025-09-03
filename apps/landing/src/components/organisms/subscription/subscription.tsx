import React, { useState } from 'react';
import SubscriptionView, {
  SubscriptionViewProps,
} from '@/components/organisms/subscription/subscription.view';
import { BILLING_CYCLE, Plan } from '@mokjang/models';
import { usePageRouter } from '@mokjang/utils';
import { CustomPopup, SvgIcon } from '@mokjang/components';
import { useScopedI18n } from '../../../../locales/client';
import CardRegister from '@/components/molecules/subscription/card-register';
import { Svg } from '@mokjang/assets';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  padding-right: 20px;
`;

const Subscription = () => {
  const t_card = useScopedI18n('card');
  const t_button = useScopedI18n('button');

  const router = usePageRouter();
  const [selectedCycle, setSelectedCycle] = useState<BILLING_CYCLE>(
    BILLING_CYCLE.MONTHLY
  );
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();

  const [isCardOpened, setIsCardOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickCycle = (cycle: BILLING_CYCLE) => {
    setSelectedCycle(cycle);
  };

  const onClickPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    window.scrollTo({
      top: 300,
      behavior: 'smooth',
    });
  };

  const onClickProceed = () => {
    setIsCardOpened(true);
  };

  const onClickClose = () => {
    setIsCardOpened(false);
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
      <CustomPopup
        isShow={isCardOpened}
        onClickCancel={onClickClose}
        headerTitle={t_card('title')}
        cancelText={t_button('cancel')}
        width={500}
        height={450}
        headerRight={
          <ButtonContainer onClick={onClickClose}>
            <SvgIcon svg={Svg.Cancel} size={18} width={2} />
          </ButtonContainer>
        }
        isFooterShown={false}
      >
        <CardRegister />
      </CustomPopup>
    </>
  );
};

export default Subscription;
