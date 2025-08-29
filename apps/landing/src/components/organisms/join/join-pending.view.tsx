import styled from 'styled-components';

import { Check } from '@mokjang/assets';
import { Button, MainText, SvgIcon } from '@mokjang/components';
import { GRAY, GREEN, LOCALE, RED, WHITE } from '@mokjang/constants';
import { useScopedI18n } from '../../../../locales/client';
import { Church } from '@/models/church/church';
import { usePathname } from 'next/navigation';
import { getTranslatedCompleteRequest } from '@/utils/translate';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 600px;
  gap: 50px;
  padding-top: 100px;
  background-color: ${WHITE};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const IconContainer = styled.div`
  display: flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background-color: ${GREEN.LIGHT};
  border-radius: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export type JoinPendingViewProps = {
  church: Church;
  onClickCancelRequest: () => void;
  onClickBackToHome: () => void;
};

const JoinPendingView = ({
  church,
  onClickCancelRequest,
  onClickBackToHome,
}: JoinPendingViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t_pending = useScopedI18n('join-pending');
  const t_button = useScopedI18n('button');
  return (
    <>
      <Container>
        <HeaderContainer>
          <IconContainer>
            <SvgIcon svg={Check} color={GREEN.DEFAULT} width={3} size={25} />
          </IconContainer>
          <MainText fontSize={24} fontWeight={700}>
            {getTranslatedCompleteRequest(locale, church.name)}
          </MainText>
          <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
            {t_pending('description')}
          </MainText>
        </HeaderContainer>
        <ButtonContainer>
          <Button
            text={t_pending('cancel')}
            width={550}
            height={50}
            fontSize={16}
            fontWeight={600}
            onClick={onClickCancelRequest}
            backgroundColor={RED.DEFAULT}
            color={WHITE}
          />
          <Button
            text={t_button('backToHome')}
            width={550}
            height={50}
            fontSize={14}
            fontWeight={400}
            onClick={onClickBackToHome}
            backgroundColor={WHITE}
            color={GRAY.DARK}
          />
        </ButtonContainer>
      </Container>
    </>
  );
};

export default JoinPendingView;
