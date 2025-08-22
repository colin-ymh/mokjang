import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/column/member-column';
import { MAIN } from '@/constants/styles/color';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${MAIN.EXTRA_LIGHT};
  border: 1px solid ${MAIN.LIGHT};
  gap: 15px;
  border-radius: 100px;
  padding: 5px 12px;
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
  cursor: pointer;
`;

const CancelButton = styled(Cancel)`
  width: 12px;
  height: 12px;
  stroke: ${MAIN.DEFAULT};
  stroke-width: 2px;
`;

export type FilteredItemType = {
  title:
    | MEMBER.GROUP
    | MEMBER.OFFICER
    | MEMBER.MARRIAGE
    | MEMBER.BAPTISM
    | MEMBER.BIRTH
    | MEMBER.REGISTERED_AT
    | MEMBER.SEARCH;
  value: (string | null)[];
};

type FilteredItemViewProps = {
  valueText: string;
  onClickCancel: () => void;
  item: FilteredItemType;
};

const FilteredItemView = ({
  valueText,
  onClickCancel,
  item,
}: FilteredItemViewProps) => {
  const t = useI18n();

  return (
    <ItemContainer>
      <TextContainer>
        <MainText color={MAIN.DARK}>{t(item.title)}</MainText>
        <MainText color={MAIN.DEFAULT}>{valueText}</MainText>
      </TextContainer>
      <ButtonContainer onClick={onClickCancel}>
        <CancelButton />
      </ButtonContainer>
    </ItemContainer>
  );
};

export default FilteredItemView;
