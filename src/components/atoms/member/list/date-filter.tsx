import { ChangeEvent } from 'react';
import styled from 'styled-components';

import BorderInput from '@/components/atoms/common/input/border-input';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

type DateFilterProps = {
  dateAfter: string;
  dateBefore: string;
  onChangeAfter: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBefore: (event: ChangeEvent<HTMLInputElement>) => void;
};

const DateFilter = ({
  dateAfter,
  dateBefore,
  onChangeAfter,
  onChangeBefore,
}: DateFilterProps) => {
  const t = useI18n();

  return (
    <FilterContainer>
      <RowContainer>
        <BorderInput
          value={dateAfter}
          onChange={onChangeAfter}
          borderColor={GRAY.LIGHT}
          height={35}
          placeholder={'YYYY-MM-DD'}
        />
        <MainText>{t('after')}</MainText>
      </RowContainer>
      <RowContainer>
        <BorderInput
          value={dateBefore}
          onChange={onChangeBefore}
          borderColor={GRAY.LIGHT}
          height={35}
          placeholder={'YYYY-MM-DD'}
        />
        <MainText>{t('before')}</MainText>
      </RowContainer>
    </FilterContainer>
  );
};

export default DateFilter;
