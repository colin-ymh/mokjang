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

import Calendar from '../../../public/svg/calendar.svg';

registerLocale('ko', ko);

const CustomDatePickerWrapper = styled.div`
  display: flex;
  z-index: 10;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
  }

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

    /* 주 선택 시 해당 주의 모든 날짜 스타일 */
    &--in-selecting-range {
      background-color: ${MAIN.LIGHT} !important;
      color: ${WHITE} !important;
    }

    &--in-range {
      background-color: ${MAIN.LIGHT} !important;
      color: ${WHITE} !important;
    }

    &--keyboard-selected {
      background-color: rgba(0, 0, 0, 0);
      color: rgb(0, 0, 0);
    }
  }
`;

const CalendarIcon = styled(Calendar)`
  width: 14px;
  height: 16px;
  stroke: ${BLACK};
  stroke-width: 1.5px;
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
  customInput?: React.ReactNode;
  /** 주 단위 선택 여부 */
  selectWeek?: boolean;
  borderColor?: string;
};

export default function CustomDatePicker({
  yearRange,
  width,
  height,
  customInput,
  selectWeek = false,
  borderColor,
  ...props
}: CustomDatePickerProps) {
  const currentYear = getYear(new Date());
  const [startYear, endYear] = yearRange ?? [currentYear - 5, currentYear + 5];
  const datePickerRef = useRef<any>(null);

  // 주의 시작일(일요일)과 끝일(토요일) 계산
  const getWeekRange = (date: Date) => {
    const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - day); // 일요일로 설정

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 토요일로 설정

    return { startOfWeek, endOfWeek };
  };

  // 날짜가 선택된 주에 포함되는지 확인
  const isInSelectedWeek = (date: Date, selectedDate: Date | null) => {
    if (!selectedDate || !selectWeek) return false;

    const { startOfWeek, endOfWeek } = getWeekRange(selectedDate);
    return date >= startOfWeek && date <= endOfWeek;
  };

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

  // 주 선택 모드일 때 추가 props
  const weekSelectProps = selectWeek
    ? {
        // 주 선택을 위한 날짜 필터링
        dayClassName: (date: Date) => {
          if (isInSelectedWeek(date, props.selected as Date)) {
            return 'react-datepicker__day--in-range';
          }
          return '';
        },
        // 주 선택 시 호버 효과
        onDayMouseEnter: (date: Date) => {
          if (!selectWeek) return;

          // 호버된 날짜의 주 전체에 스타일 적용
          const { startOfWeek, endOfWeek } = getWeekRange(date);
          const days = document.querySelectorAll('.react-datepicker__day');

          days.forEach((dayElement) => {
            const dayDate = new Date(
              dayElement.getAttribute('aria-label') || ''
            );
            if (dayDate >= startOfWeek && dayDate <= endOfWeek) {
              dayElement.classList.add(
                'react-datepicker__day--in-selecting-range'
              );
            }
          });
        },
        onDayMouseLeave: () => {
          if (!selectWeek) return;

          // 호버 효과 제거
          const days = document.querySelectorAll(
            '.react-datepicker__day--in-selecting-range'
          );
          days.forEach((dayElement) => {
            dayElement.classList.remove(
              'react-datepicker__day--in-selecting-range'
            );
          });
        },
      }
    : {};

  return (
    <CustomDatePickerWrapper>
      <DatePicker
        {...props}
        {...weekSelectProps}
        ref={datePickerRef}
        locale="ko"
        renderCustomHeader={customHeader}
        onSelect={handleSelect}
        customInput={
          customInput || (
            <BorderInput
              width={width}
              height={height}
              borderColor={borderColor}
              icon={<CalendarIcon />}
            />
          )
        }
        showTimeSelect={false}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        popperPlacement={'bottom-start'}
      />
    </CustomDatePickerWrapper>
  );
}
