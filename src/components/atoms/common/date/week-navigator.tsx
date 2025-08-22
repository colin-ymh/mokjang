import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { GRAY, WHITE } from '@/constants/styles/color';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import { getDateInWeekByDayOfWeek, getDateStringFromDate } from '@/utils/date';
import LabelInput from '@/components/atoms/common/input/label-input';
import { useI18n } from '../../../../../locales/client';

import ChevronLeft from '../../../../../public/svg/chevron-left.svg';
import ChevronRight from '../../../../../public/svg/chevron-right.svg';
import Calendar from '../../../../../public/svg/calendar.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

const WeekNavigatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
  margin-top: -6px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

type WeekNavigatorProps = {
  value?: Date;
  dayOfWeek: number;
  weekPeriod: number;
  onChange: (value: Date) => void;
};

const WeekNavigator = ({
  value,
  dayOfWeek,
  weekPeriod,
  onChange,
}: WeekNavigatorProps) => {
  const t = useI18n();

  const [innerValue, setInnerValue] = useState<Date>(() => {
    const date =
      value instanceof Date && !isNaN(value.getTime()) ? value : new Date();
    return new Date(date.getTime());
  });

  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setInnerValue(new Date(value.getTime()));
    }
  }, [value]);

  const onClickLeft = () => {
    if (!isNaN(innerValue.getTime())) {
      const newDate = new Date(
        innerValue.getTime() - weekPeriod * 7 * 24 * 60 * 60 * 1000
      );
      setInnerValue(newDate);
      onChange(newDate); // 직접 호출
    }
  };

  const onClickRight = () => {
    if (!isNaN(innerValue.getTime())) {
      const newDate = new Date(
        innerValue.getTime() + weekPeriod * 7 * 24 * 60 * 60 * 1000
      );
      setInnerValue(newDate);
      onChange(newDate); // 직접 호출
    }
  };

  const onChangeDate = (date: Date | null) => {
    if (date && !isNaN(date.getTime())) {
      const targetDate = getDateInWeekByDayOfWeek(date, dayOfWeek);
      setInnerValue(targetDate);
      onChange(targetDate); // 직접 호출
    }
  };

  if (!innerValue || isNaN(innerValue.getTime())) {
    return null;
  }

  return (
    <WeekNavigatorContainer>
      <CustomDatePicker
        selected={innerValue}
        onChange={onChangeDate}
        customInput={
          <LabelInput
            icon={<SvgIcon svg={Calendar} />}
            label={t('date')}
            value={getDateStringFromDate(innerValue)}
          />
        }
        selectWeek={true}
      />
      <ButtonContainer>
        <Button
          icon={<SvgIcon svg={ChevronLeft} />}
          onClick={onClickLeft}
          width={30}
          height={30}
          backgroundColor={WHITE}
          borderColor={GRAY.LIGHT}
        />
        <MainText color={GRAY.DARK} size={SIZE.SMALL}>
          {t('prevNextWeek')}
        </MainText>
        <Button
          icon={<SvgIcon svg={ChevronRight} />}
          onClick={onClickRight}
          width={30}
          height={30}
          backgroundColor={WHITE}
          borderColor={GRAY.LIGHT}
        />
      </ButtonContainer>
    </WeekNavigatorContainer>
  );
};

export default WeekNavigator;
