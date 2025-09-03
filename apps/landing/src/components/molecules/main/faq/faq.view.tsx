import styled from 'styled-components';
import { Button, MainText } from '@mokjang/components';
import { GRAY, WHITE } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../locales/client';
import FaqItem from '@/components/atoms/main/faq/faq-item';
import { FAQ } from '@/constants/constant';

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 1000px;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 100px 0 50px 0;
`;

const ExtraContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;

export type FaqViewProps = {
  openedQuestion: FAQ | undefined;
  onClickQuestion: (id: FAQ) => void;
  onClickContact: () => void;
};

const FaqView = ({
  openedQuestion,
  onClickQuestion,
  onClickContact,
}: FaqViewProps) => {
  const t_main = useScopedI18n('main.faq');
  const t_button = useScopedI18n('button');

  return (
    <FAQContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_main('title')}
        </MainText>
        <MainText fontSize={20} color={GRAY.DARK}>
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
        <Button
          text={t_button('contact')}
          color={WHITE}
          height={40}
          width={120}
          fontSize={16}
          fontWeight={400}
          onClick={onClickContact}
        />
      </ExtraContainer>
    </FAQContainer>
  );
};

export default FaqView;
