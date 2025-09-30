import styled from 'styled-components';
import { Button, MainText } from '@mokjang/components';
import { GRAY, GREEN, MEDIA_MAX_WIDTH } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../locales/client';
import FaqItem from '@/components/atoms/main/faq/faq-item';
import { FAQ } from '@/constants/constant';

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 850px;
  padding: 50px 0;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 0 20px;
    width: auto;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 100px 0 50px 0;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const ExtraContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export type FaqViewProps = {
  openedQuestion: FAQ | undefined;
  onClickQuestion: (id: FAQ) => void;
  onClickContact: () => void;
  onClickDonate: () => void;
};

const FaqView = ({
  openedQuestion,
  onClickQuestion,
  onClickContact,
  onClickDonate,
}: FaqViewProps) => {
  const t_main = useScopedI18n('main.faq');
  const t_button = useScopedI18n('button');

  return (
    <FAQContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700} whiteSpace={'normal'}>
          {t_main('title')}
        </MainText>
        <MainText fontSize={20} color={GRAY.DARK} whiteSpace={'normal'}>
          {t_main('description')}
        </MainText>
      </HeaderContainer>
      <FAQList>
        {Object.values(FAQ).map((item) => (
          <FaqItem
            key={item}
            id={item}
            isOpened={openedQuestion === item}
            onClick={onClickQuestion}
          />
        ))}
      </FAQList>
      <ExtraContainer>
        <MainText fontSize={16} color={GRAY.DARK}>
          {t_main('extra')}
        </MainText>
        <ButtonContainer>
          <Button
            text={t_button('contact')}
            borderRadius={10}
            height={50}
            width={120}
            fontSize={16}
            fontWeight={500}
            onClick={onClickContact}
          />
          <Button
            text={t_button('donate')}
            borderRadius={10}
            height={50}
            width={170}
            fontSize={16}
            fontWeight={500}
            onClick={onClickDonate}
            backgroundColor={GREEN.DEFAULT}
          />
        </ButtonContainer>
      </ExtraContainer>
    </FAQContainer>
  );
};

export default FaqView;
