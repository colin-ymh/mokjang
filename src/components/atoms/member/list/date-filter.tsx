import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import DateInput from '@/components/atoms/common/input/date-input';
import { getDateFromString } from '@/utils/date';

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
  onChangeAfter: (date: Date | null) => void;
  onChangeRawAfter: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBefore: (date: Date | null) => void;
  onChangeRawBefore: (event: ChangeEvent<HTMLInputElement>) => void;
};

const DateFilter = ({
  dateAfter,
  dateBefore,
  onChangeAfter,
  onChangeRawAfter,
  onChangeBefore,
  onChangeRawBefore,
}: DateFilterProps) => {
  const t = useI18n();

  return (
    <FilterContainer>
      <RowContainer>
        <DateInput
          value={dateAfter}
          selected={getDateFromString(dateAfter)}
          onChange={onChangeAfter}
          onChangeRaw={onChangeRawAfter}
          borderColor={GRAY.SEMI_LIGHT}
          height={35}
          placeholder={'YYYY-MM-DD'}
        />
        <MainText>{t('after')}</MainText>
      </RowContainer>
      <RowContainer>
        <DateInput
          value={dateBefore}
          selected={getDateFromString(dateBefore)}
          onChange={onChangeBefore}
          onChangeRaw={onChangeRawBefore}
          borderColor={GRAY.SEMI_LIGHT}
          height={35}
          placeholder={'YYYY-MM-DD'}
        />
        <MainText>{t('before')}</MainText>
      </RowContainer>
    </FilterContainer>
  );
};

export default DateFilter;
