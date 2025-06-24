import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useEffect, useState } from 'react';
import { GRAY } from '@/constants/styles/color';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import { getDateInWeekByDayOfWeek, getDateStringFromDate } from '@/utils/date';

const WeekNavigatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100px;
  height: 38px;
  border-top: 1px solid ${GRAY.DEFAULT};
  border-bottom: 1px solid ${GRAY.DEFAULT};
`;

const LeftNavigateButton = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border: 1px solid ${GRAY.DEFAULT};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 30px;
`;

const RightNavigateButton = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border: 1px solid ${GRAY.DEFAULT};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 30px;
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
      <LeftNavigateButton onClick={onClickLeft}>
        <MainText>{'<'}</MainText>
      </LeftNavigateButton>
      <CustomDatePicker
        selected={innerValue}
        onChange={onChangeDate}
        customInput={
          <DateContainer>
            <MainText>{getDateStringFromDate(innerValue)}</MainText>
          </DateContainer>
        }
        selectWeek={true}
      />
      <RightNavigateButton onClick={onClickRight}>
        <MainText>{'>'}</MainText>
      </RightNavigateButton>
    </WeekNavigatorContainer>
  );
};

export default WeekNavigator;
