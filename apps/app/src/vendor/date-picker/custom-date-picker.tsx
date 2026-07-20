'use client';

import React, { useEffect, useRef, useState } from 'react';
import DatePicker, {
  DatePickerProps,
  ReactDatePickerCustomHeaderProps,
  registerLocale,
} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styled, {
  createGlobalStyle,
  StyleSheetManager,
} from 'styled-components';
import { ko } from 'date-fns/locale';

import { BLACK, CURSOR, GRAY, MAIN, RED, WHITE } from '@mokjang/constants';
import { getMonth, getYear } from 'date-fns';
import { BorderInput, Button, SvgIcon } from '@mokjang/components';
import _ from 'lodash';
import { Svg } from '@mokjang/assets';

import { Chevron } from '../../components/atoms/common/dropdown/dropdown-chevron';

registerLocale('ko', ko);

const CustomDatePickerWrapper = styled.div`
  display: block;
  z-index: 10;
  width: 100%;

  .react-datepicker-wrapper {
    width: 100%;
    display: block;
  }

  .react-datepicker__input-container {
    width: 100%;
    display: block;
    position: relative;
    box-sizing: border-box;
  }

  .react-datepicker__input-container > * {
    width: 100%;
    display: block;
    box-sizing: border-box;
  }
`;

const DatePickerPortalStyles = createGlobalStyle`
  /* 포탈 전용 팝업 스타일: 포탈 DOM(#date-picker-portal)에만 주입됨 */
  .date-picker-popper {
    z-index: 2000; /* 모달/드로어 위로 */
  }

  /* 포탈 오버레이 배경 밝기 조정 */
  .react-datepicker__portal {
    background-color: rgba(0, 0, 0, 0.1) !important; /* 덜 어둡게 */
  }

  /* 달력 본체 */
  .date-picker-calendar {
    box-sizing: border-box;
    border-radius: 10px;
    border: none;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    padding: 20px;
  }

  /* 달력 상단 헤더 (타이틀 / 닫기) */
  .date-picker-calendar .mj-top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative; /* full-width divider 기준 */
  }
  .date-picker-calendar .react-datepicker__month-container {
    padding: 0; /* 달력 본문 패딩 제거 */
  }
  .date-picker-calendar .mj-title {
    font-size: 16px;
    font-weight: 600;
    color: ${BLACK};
  }
  .date-picker-calendar .mj-close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: ${GRAY.DARK};
    cursor: pointer;
  }
  .date-picker-calendar .mj-close-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${MAIN.LIGHT};
  }

  /* 팝업 위 삼각형 제거 (react-datepicker 기본) */
  .date-picker-popper .react-datepicker__triangle {
    display: none;
  }

  /* ===== 달력 전반 스타일 (포탈 스코프) ===== */
  .date-picker-calendar { font-size: 14px; }

  /* 헤더 */
  .date-picker-calendar .react-datepicker__header {
    background-color: ${WHITE};
    border-bottom: none !important; /* remove default divider */
    box-shadow: none !important;    /* guard against theme shadows */
    padding: 0 !important;          /* 좌우 패딩 제거 → 내부 헤더(border)가 전체 width 차지 */
    margin-bottom: 0 !important;    /* 일부 테마에서 헤더 하단 마진 제거 */
  }

  /* 헤더 드롭다운(연/월) 공통 스타일 */
  .date-picker-calendar .mj-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    font-size: 14px;
    line-height: 1.2;
    padding: 8px 40px 8px 12px; /* 좌우 여백 + 아이콘 자리 */
    border: 1px solid ${GRAY.LIGHT};
    border-radius: 8px;
    background-color: ${WHITE};
    color: ${BLACK};
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    position: relative;
    background-image: none !important;
    cursor: pointer;
  }

  /* 포커스/호버 상태 */
  .date-picker-calendar .mj-select:focus,
  .date-picker-calendar .mj-select:hover {
    border-color: ${GRAY.LIGHT}; /* 강조 제거 */
    box-shadow: none;            /* 강조 제거 */
  }

  /* 비활성화 상태 */
  .date-picker-calendar .mj-select:disabled {
    background-color: ${GRAY.SEMI_LIGHT};
    color: ${GRAY.DARK} !important;
    cursor: not-allowed;
  }

  /* IE 전용 기본 화살표 제거 */
  .date-picker-calendar .mj-select::-ms-expand { display: none; }

  .date-picker-calendar .mj-select-wrapper { position: relative; display: inline-block; padding: 20px 0;}
  .date-picker-calendar .mj-select-chevron {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    pointer-events: none; /* 클릭 방해 방지 */
  }

  /* 요일 셀 (월, 화, 수, ...) */
  .date-picker-calendar .react-datepicker__day-names {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 0;
    gap: 5px !important;
    padding: 0 !important;
    justify-content: stretch;
    width: 100%;
  }
  .date-picker-calendar .react-datepicker__day-names {
    margin-bottom: 0 !important;   /* 요일행과 날짜 그리드 간격 축소 */
    background: transparent;
  }
  .date-picker-calendar .react-datepicker__month {
    margin-top: 0.166rem !important; /* day 마진과 균형 맞춤 */
  }
  .date-picker-calendar .react-datepicker__day-name {
    /* day 셀(0.166rem margin, 정사각)과 동일한 공간감 */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.4rem;           /* react-datepicker 기본 day 높이와 유사 */
    line-height: 2.4rem;
    margin: 0;         /* day와 동일 margin */
    color: ${GRAY.DARK};
  }
  /* Remove border under weekday row */
  .date-picker-calendar .react-datepicker__day-names {
    border-bottom: none;
  }
  /* Sunday weekday name and Sunday dates (not outside-month, not disabled) */
  .date-picker-calendar .react-datepicker__day-name:nth-child(1),
  .date-picker-calendar .react-datepicker__day:nth-child(7n+1):not(.react-datepicker__day--outside-month):not([aria-disabled='true']) {
    color: ${RED.DEFAULT};
  }

  /* Saturday weekday name and Saturday dates (not outside-month, not disabled) */
  .date-picker-calendar .react-datepicker__day-name:nth-child(7),
  .date-picker-calendar .react-datepicker__day:nth-child(7n):not(.react-datepicker__day--outside-month):not([aria-disabled='true']) {
    color: ${MAIN.DEFAULT};
  }

  /* Disabled 날짜 → 항상 회색 */
  .date-picker-calendar .react-datepicker__day[aria-disabled='true'],
  .date-picker-calendar .react-datepicker__day--disabled {
    color: ${GRAY.LIGHT} !important;
    pointer-events: none;
  }
  
  /* 보여지는 달력에서, 해당 월이 아닌 다른 달 날짜는 회색 + 클릭 막기 */
  .date-picker-calendar .react-datepicker__day--outside-month {
    color: ${GRAY.LIGHT} !important;
    pointer-events: none;
  }


  /* 날짜 셀 */
  .date-picker-calendar .react-datepicker__day { cursor: pointer; }
  .date-picker-calendar .react-datepicker__day:not([aria-disabled='true']):hover {
    border-radius: 10px;
    background-color: ${GRAY.LIGHT};
    box-shadow: none;
  }
  .date-picker-calendar .react-datepicker__day--in-selecting-range,
  .date-picker-calendar .react-datepicker__day--in-range {
    border-radius: 10px;
    background-color: ${MAIN.DEFAULT} !important;
    color: ${WHITE} !important;
  }

  /* ===== 오늘 날짜 강조: 테두리 표시 ===== */
  .date-picker-calendar .react-datepicker__day--today {
    /* 기본 굵기 강조는 유지하면서 */
    font-weight: 700;

    /* 반경은 기존 day와 동일하게 */
    border-radius: 10px;

    /* 테두리는 box-shadow inset으로 깔끔하게 (border보다 레이아웃 안전) */
    box-shadow: inset 0 0 0 2px ${GRAY.DEFAULT}; /* 원하는 색/두께로 */
  }

  
  .date-picker-calendar .react-datepicker__day--selected {
    border-radius: 10px;
    background-color: ${MAIN.DEFAULT};
    color: ${WHITE} !important;
    box-shadow: none;
  }
  
  .date-picker-calendar .react-datepicker__day--keyboard-selected {
    background-color: rgba(0, 0, 0, 0);
    color: rgb(0, 0, 0);
  }

  /* 📱 모바일에서 전체화면 처리 */
  @media (max-width: 768px) {
    
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  padding: 0; /* 헤더 패딩 제거 */
  justify-content: space-between;
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
  /** 달력 상단 헤더 타이틀 */
  headerTitle?: React.ReactNode;
};

export default function CustomDatePicker({
  yearRange,
  width,
  height,
  customInput,
  selectWeek = false,
  borderColor,
  headerTitle,
  ...props
}: CustomDatePickerProps) {
  const currentYear = getYear(new Date());
  const [startYear, endYear] = yearRange ?? [currentYear - 5, currentYear + 5];
  const datePickerRef = useRef<any>(null);

  useEffect(() => {
    const id = 'date-picker-portal';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
  }, []);

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalEl(document.getElementById('date-picker-portal'));
  }, []);

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
    <>
      <div className="mj-top-header">
        <div className="mj-title">{headerTitle}</div>
        <button
          type="button"
          className="mj-close-btn"
          aria-label="달력 닫기"
          onClick={() => datePickerRef.current?.setOpen?.(false)}
        >
          <SvgIcon
            svg={Svg.Cancel}
            cursor={CURSOR.POINTER}
            size={16}
            width={2}
          />
        </button>
      </div>
      <HeaderContainer>
        <Button
          icon={<SvgIcon svg={Svg.ChevronLeft} cursor={CURSOR.POINTER} />}
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          width={50}
          backgroundColor={WHITE}
          color={GRAY.DARK}
        />
        <div className="mj-select-wrapper">
          <select
            className="mj-select"
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(Number(value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <Chevron className="mj-select-chevron" $isOpened={false} />
        </div>

        <div className="mj-select-wrapper">
          <select
            className="mj-select"
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <Chevron className="mj-select-chevron" $isOpened={false} />
        </div>
        <Button
          icon={<SvgIcon svg={Svg.ChevronRight} cursor={CURSOR.POINTER} />}
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          width={50}
          backgroundColor={WHITE}
          color={GRAY.DARK}
        />
      </HeaderContainer>
    </>
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
      {portalEl && (
        <StyleSheetManager target={portalEl}>
          <DatePickerPortalStyles />
        </StyleSheetManager>
      )}
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
              width={width ?? undefined}
              height={height}
              borderColor={borderColor}
              readOnly
              inputMode="none"
              onFocus={(e) => e.target.blur()}
              icon={
                <SvgIcon
                  svg={Svg.Calendar}
                  color={GRAY.DEFAULT}
                  width={1.5}
                  size={16}
                />
              }
              style={{ width: '100%' }}
            />
          )
        }
        showTimeSelect={false}
        dateFormat="yyyy-MM-dd"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        withPortal
        portalId="date-picker-portal"
        popperClassName="date-picker-popper"
        calendarClassName="date-picker-calendar"
        popperPlacement={'bottom-start'}
        onCalendarClose={() => {
          setTimeout(() => {
            // 현재 포커스된 게 무엇이든 날려버림
            requestAnimationFrame(() => {
              const el = document.activeElement as HTMLElement | null;
              el?.blur?.();
            });
          }, 100);
        }}
      />
    </CustomDatePickerWrapper>
  );
}
