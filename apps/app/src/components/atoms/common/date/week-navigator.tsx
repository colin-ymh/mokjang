import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { GRAY, SIZE } from '@mokjang/constants';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateInWeekByDayOfWeek,
  getDateStringFromDate,
} from '@mokjang/utils';
import { useI18n } from '../../../../../locales/client';

import { Svg } from '@mokjang/assets';
import { BorderInput, MainText, SvgIcon } from '@mokjang/components';

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid ${GRAY.LIGHT};
  border-right: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  transition: border-color 0.2s ease;

  // /* 내부 경계선은 항상 GRAY */
  // box-shadow: inset 1px 0 0 ${GRAY.LIGHT};
`;

const RightButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid ${GRAY.LIGHT};
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  transition: border-color 0.2s ease;
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
    <LabelContainer>
      <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
        {t('date')}
      </MainText>
      <RowContainer>
        <LeftButton onClick={onClickLeft}>
          <SvgIcon svg={Svg.ChevronLeft} />
        </LeftButton>
        <CustomDatePicker
          selected={innerValue}
          onChange={onChangeDate}
          customInput={
            <BorderInput
              icon={<SvgIcon svg={Svg.Calendar} />}
              value={getDateStringFromDate(innerValue)}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
            />
          }
          selectWeek={true}
        />
        <RightButton onClick={onClickRight} disabled={!canGoRight}>
          <SvgIcon svg={Svg.ChevronRight} />
        </RightButton>
      </RowContainer>
    </LabelContainer>
  );
};

export default WeekNavigator;
