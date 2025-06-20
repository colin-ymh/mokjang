'use client';

import React, { useRef } from 'react';
import DatePicker, {
  DatePickerProps,
  ReactDatePickerCustomHeaderProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styled from 'styled-components';
import { ko } from 'date-fns/locale';

import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { getMonth, getYear } from 'date-fns';
import Button from '@/components/atoms/common/button/button';
import BorderInput from '@/components/atoms/common/input/border-input';
import _ from 'lodash';

registerLocale('ko', ko);

const CustomDatePickerWrapper = styled.div`
  display: flex;
  z-index: 10;
  // 달력 팝업 영역
  .react-datepicker-popper {
    // 팝업 위 삼각형
    .react-datepicker__triangle {
      display: none;
    }
  }

  // 헤더
  .react-datepicker__header {
    background-color: ${WHITE};

    .button {
      background-color: orange;
    }
  }

  /* 보여지는 달력에서, 해당 월이 아닌 다른 달 날짜는 회색 + 클릭 막기 */
  .react-datepicker__day--outside-month {
    color: ${GRAY.DEFAULT} !important;
    pointer-events: none;
  }

  /* 달력 요일 셀 (예: 월, 화, 수, ...) */
  .react-datepicker__day-name {
    width: 28px;
    color: ${BLACK};
  }

  /* 달력 전체 글자 크기 */
  .react-datepicker {
    font-size: 14px;
  }

  .react-datepicker__day {
    cursor: pointer;

    &:not([aria-disabled='true']):hover {
      border-radius: 100%;
      background-color: ${GRAY.SEMI_LIGHT};
    }

    &--today {
      font-weight: bold;
    }

    &--selected {
      border-radius: 100%;
      background-color: ${MAIN.DEFAULT};
    }

    &--keyboard-selected {
      background-color: rgba(0, 0, 0, 0);
      color: rgb(0, 0, 0);
    }
  }
`;

const HeaderContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 5px;
`;

/** 타입 정의 (DatePickerProps와 교차) */
export type CustomDatePickerProps = DatePickerProps & {
  /** yearRange?: [시작연도, 끝연도] */
  yearRange?: [number, number];
  /** (react-datepicker는 원래 value 사용X, selected로 동작) */
  value?: string;
  width?: number;
  height?: number;
  /** 최소 선택 가능 날짜 */
  minDate?: string;
  /** 최대 선택 가능 날짜 */
  maxDate?: string;
};

export default function CustomDatePicker({
  yearRange,
  width,
  height,
  minDate,
  maxDate,
  ...props
}: CustomDatePickerProps) {
  const currentYear = getYear(new Date());
  const [startYear, endYear] = yearRange ?? [currentYear - 5, currentYear + 5];
  const datePickerRef = useRef<any>(null);

  const focusTimeInput = () => {
    // 재시도 횟수 제한
    let attempts = 0;
    const maxAttempts = 5;

    const tryFocus = () => {
      const timeInput = document.querySelector<HTMLInputElement>(
        '.react-datepicker__time-container input[type="time"]'
      );

      if (timeInput) {
        timeInput.focus();
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryFocus, 50); // 재시도
      }
    };

    tryFocus();
  };

  const handleSelect = (date: Date | null) => {
    if (!date) return;

    // 기존 selected와 동일하면 무시
    const prev = props.selected;
    const prevTime = prev instanceof Date ? prev.getTime() : null;
    const newTime = date.getTime();
    if (prevTime === newTime) return;

    (props.onChange as (date: Date) => void)?.(date);
  };

  const years = _.range(startYear, endYear + 1);
  const months = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];

  const customHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => (
    <HeaderContainer>
      <Button
        text={`<`}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        width={50}
        backgroundColor={WHITE}
        color={GRAY.DARK}
      />
      <select
        value={getYear(date)}
        onChange={({ target: { value } }) => changeYear(Number(value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      <select
        value={months[getMonth(date)]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
      <Button
        text={`>`}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        width={50}
        backgroundColor={WHITE}
        color={GRAY.DARK}
      />
    </HeaderContainer>
  );

  return (
    <CustomDatePickerWrapper>
      <DatePicker
        {...props}
        ref={datePickerRef}
        locale="ko"
        renderCustomHeader={customHeader}
        onSelect={handleSelect}
        customInput={
          <BorderInput width={width} height={height} readOnly={true} />
        }
        showTimeSelect={false}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        popperPlacement={'bottom-start'}
        minDate={minDate ? new Date(minDate) : new Date(1999, 0, 1)}
        maxDate={maxDate ? new Date(maxDate) : new Date(2100, 11, 31)}
      />
    </CustomDatePickerWrapper>
  );
}
