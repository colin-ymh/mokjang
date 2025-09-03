import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { DESTRUCTIVE } from '../../../../constants/styles/color';

import { useI18n } from '../../../../../locales/client';
import Reset from '../../../../../public/svg/arrow-path.svg';

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${DESTRUCTIVE.EXTRA_LIGHT};
  border: 1px solid ${DESTRUCTIVE.LIGHT};
  gap: 10px;
  border-radius: 100px;
  padding: 5px 12px;
  cursor: pointer;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResetButton = styled(Reset)`
  width: 12px;
  height: 12px;
  stroke: ${DESTRUCTIVE.DARK};
  stroke-width: 2px;
`;

type ResetFilteredItemViewProps = {
  onClickReset: () => void;
};

const ResetFilteredItemView = ({
  onClickReset,
}: ResetFilteredItemViewProps) => {
  const t = useI18n();

  return (
    <ItemContainer onClick={onClickReset}>
      <ButtonContainer>
        <ResetButton />
      </ButtonContainer>
      <TextContainer>
        <MainText color={DESTRUCTIVE.DARK}>{t('resetFilter')}</MainText>
      </TextContainer>
    </ItemContainer>
  );
};

export default ResetFilteredItemView;
