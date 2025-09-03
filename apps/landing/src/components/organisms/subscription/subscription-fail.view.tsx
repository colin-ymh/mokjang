import styled from 'styled-components';

import { Svg } from '@mokjang/assets';
import {
  Button,
  MainText,
  SvgIcon,
} from '../../../../../../packages/components/src';
import {
  BLACK,
  GRAY,
  LOCALE,
  RED,
  WHITE,
} from '../../../../../../packages/constants/src';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { getTranslatedMonthlySubscriptionPrice } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { getTranslatedDateFromDateString } from '@mokjang/app/src/utils/translate';
import { getTimeStringFromDate } from '@mokjang/app/src/utils/date';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 800px;
  gap: 40px;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const IconContainer = styled.div`
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background-color: ${RED.LIGHT};
  border-radius: 100%;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  border: 1px solid ${GRAY.LIGHT};
  width: 360px;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const RowLine = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  width: 100%;
`;

export type SubscriptionFailViewProps = {
  onClickRetry: () => void;
};

const SubscriptionFailView = ({ onClickRetry }: SubscriptionFailViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_payment = useScopedI18n('payment-fail');
  return (
    <>
      <Container>
        <HeaderContainer>
          <IconContainer>
            <SvgIcon svg={Svg.Cancel} color={RED.DEFAULT} width={3} size={25} />
          </IconContainer>
          <MainText fontSize={24} fontWeight={700}>
            {t_payment('title')}
          </MainText>
          <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
            {t_payment('description')}
          </MainText>
        </HeaderContainer>
        <BoxContainer>
          <RowContainer>
            <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
              {t_payment('name')}
            </MainText>
            <MainText fontSize={16} fontWeight={600}>
              {'베이직'}
            </MainText>
          </RowContainer>
          <RowContainer>
            <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
              {t('price')}
            </MainText>
            <MainText fontSize={16} fontWeight={600}>
              {getTranslatedMonthlySubscriptionPrice(locale, 79000)}
            </MainText>
          </RowContainer>
          <RowLine />
          <RowContainer>
            <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
              {t_payment('time')}
            </MainText>
            <MainText fontSize={14} fontWeight={400}>
              {`${getTranslatedDateFromDateString(locale, '2025-08-18')} ${getTimeStringFromDate(new Date())}`}
            </MainText>
          </RowContainer>
          <RowContainer>
            <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
              {t_payment('case')}
            </MainText>
            <MainText fontSize={14} fontWeight={400}>
              {'카드 정보 불일치'}
            </MainText>
          </RowContainer>
        </BoxContainer>
        <Button
          text={t_button('retry')}
          backgroundColor={BLACK}
          color={WHITE}
          height={60}
          borderRadius={10}
          width={400}
          fontSize={16}
          fontWeight={500}
          onClick={onClickRetry}
        />
      </Container>
    </>
  );
};

export default SubscriptionFailView;
