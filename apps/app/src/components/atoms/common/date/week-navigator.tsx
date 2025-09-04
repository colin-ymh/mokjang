import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { GRAY, WHITE } from '@mokjang/constants';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateInWeekByDayOfWeek,
  getDateStringFromDate,
} from '@mokjang/utils';
import { useI18n } from '../../../../../locales/client';

import { Svg } from '@mokjang/assets';
import { SvgIcon } from '@mokjang/components';
import { Button } from '@mokjang/components';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';
import { BorderInput } from '@mokjang/components';

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const WeekNavigatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: center;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
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
      // 미래 회차로 넘어갈 수 없도록 차단
      if (startOfDay(newDate).getTime() > startOfDay(new Date()).getTime())
        return;
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

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const todaySOD = startOfDay(new Date());
  const nextPeriodDate = new Date(
    innerValue.getTime() + weekPeriod * 7 * MS_PER_DAY
  );
  const canGoRight = startOfDay(nextPeriodDate).getTime() <= todaySOD.getTime();

  return (
    <WeekNavigatorContainer>
      <LabelContainer>
        <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
          {t('date')}
        </MainText>
        <CustomDatePicker
          selected={innerValue}
          onChange={onChangeDate}
          customInput={
            <BorderInput
              icon={<SvgIcon svg={Svg.Calendar} />}
              value={getDateStringFromDate(innerValue)}
            />
          }
          selectWeek={true}
        />
      </LabelContainer>
      <ButtonContainer>
        <Button
          icon={<SvgIcon svg={Svg.ChevronLeft} />}
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
          icon={<SvgIcon svg={Svg.ChevronRight} />}
          onClick={onClickRight}
          width={30}
          height={30}
          backgroundColor={WHITE}
          borderColor={GRAY.LIGHT}
          disabled={!canGoRight}
        />
      </ButtonContainer>
    </WeekNavigatorContainer>
  );
};

export default WeekNavigator;
