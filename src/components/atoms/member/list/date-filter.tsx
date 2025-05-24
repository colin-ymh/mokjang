import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getDateFromDateString } from '@/utils/date';

import { useI18n } from '../../../../../locales/client';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';

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
        <CustomDatePicker
          value={dateAfter}
          selected={dateAfter ? getDateFromDateString(dateAfter) : null}
          onChange={onChangeAfter}
          // onChangeRaw={onChangeRawAfter}
          // borderColor={GRAY.SEMI_LIGHT}
          height={35}
          placeholderText={t('startDate')}
        />
        <MainText>{t('after')}</MainText>
      </RowContainer>
      <RowContainer>
        <CustomDatePicker
          value={dateBefore}
          selected={dateBefore ? getDateFromDateString(dateBefore) : null}
          onChange={onChangeBefore}
          // onChangeRaw={onChangeRawBefore}
          // borderColor={GRAY.SEMI_LIGHT}
          height={35}
          placeholderText={t('endDate')}
        />
        <MainText>{t('before')}</MainText>
      </RowContainer>
    </FilterContainer>
  );
};

export default DateFilter;
