import { FAQ } from '@/constants/constant';
import styled from 'styled-components';
import { useScopedI18n } from '../../../../../locales/client';
import { GRAY, MAIN, WHITE } from '../../../../../../../packages/constants/src';

import Plus from '../../../../../public/svg/plus.svg';
import Minus from '../../../../../public/svg/minus.svg';
import {
  MainText,
  SvgIcon,
} from '../../../../../../../packages/components/src';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: ${WHITE};
  width: 1000px;
  padding: 30px 0;
  gap: 30px;
  cursor: pointer;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
`;

type FaqItemProps = {
  id: FAQ;
  isOpened: boolean;
  onClick: (id: FAQ) => void;
};

const FaqItem = ({ id, isOpened, onClick }: FaqItemProps) => {
  const t_faq = useScopedI18n(`faq.${id}`);
  return (
    <>
      <ItemContainer onClick={() => onClick(id)}>
        <RowContainer>
          <MainText fontSize={18} fontWeight={600}>
            {t_faq('question')}
          </MainText>
          <SvgIcon
            svg={isOpened ? Minus : Plus}
            color={MAIN.DEFAULT}
            width={2}
            size={18}
          />
        </RowContainer>
        {isOpened && (
          <RowContainer>
            <MainText
              fontSize={16}
              fontWeight={400}
              color={GRAY.DARK}
              whiteSpace={'normal'}
              lineHeight={25}
            >
              {t_faq('answer')}
            </MainText>
          </RowContainer>
        )}
      </ItemContainer>
    </>
  );
};

export default FaqItem;
