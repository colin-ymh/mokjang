import styled from 'styled-components';

import { Svg } from '@mokjang/assets';
import {
  Button,
  MainText,
  SvgIcon,
} from '../../../../../../packages/components/src';
import { GRAY, GREEN, WHITE } from '../../../../../../packages/constants/src';
import { useScopedI18n } from '../../../../locales/client';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 800px;
  gap: 100px;
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

export type ContactCompleteViewProps = {
  onClickBackToHome: () => void;
};

const ContactCompleteView = ({
  onClickBackToHome,
}: ContactCompleteViewProps) => {
  const t_contact = useScopedI18n('contact-complete');
  const t_button = useScopedI18n('button');
  return (
    <>
      <Container>
        <HeaderContainer>
          <IconContainer>
            <SvgIcon
              svg={Svg.Check}
              color={GREEN.DEFAULT}
              width={3}
              size={25}
            />
          </IconContainer>
          <MainText fontSize={24} fontWeight={700}>
            {t_contact('title')}
          </MainText>
          <MainText fontSize={16} fontWeight={400} color={GRAY.DARK}>
            {t_contact('description')}
          </MainText>
        </HeaderContainer>
        <Button
          text={t_button('backToHome')}
          width={550}
          height={50}
          fontSize={16}
          fontWeight={600}
          onClick={onClickBackToHome}
        />
      </Container>
    </>
  );
};

export default ContactCompleteView;
