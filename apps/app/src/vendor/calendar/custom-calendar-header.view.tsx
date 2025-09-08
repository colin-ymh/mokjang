import { ToolbarProps } from 'react-big-calendar';
import {
  Button,
  CustomPopup,
  MainText,
  SvgIcon,
  TransparentBackground,
} from '@mokjang/components';
import styled from 'styled-components';
import { CURSOR, GRAY, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../locales/client';
import { useParams } from 'next/navigation';
import Dropdown from '../../components/atoms/common/dropdown/dropdown';
import { getShortEnglishMonthName } from '@mokjang/utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import DomainFilter from './domain-filter';
import React from 'react';
import AddChurchEvent from '../../components/organisms/church-event/add/add-church-event';
import ToggleButton from '../../components/atoms/common/button/toggle-button';

import { Svg } from '@mokjang/assets';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
  background-color: ${WHITE};
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const TitleContainer = styled.div<{ $isKO: boolean }>`
  display: flex;
  flex-direction: ${({ $isKO }) => ($isKO ? 'row-reverse' : 'row')};
`;

const DropdownContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-direction: row;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: row;
  align-items: center;
`;

const FilterContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  position: absolute;

  z-index: 60;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  top: 50px;
  right: 0;
`;

export enum NAVIGATE_ACTION {
  PREV = 'PREV',
  NEXT = 'NEXT',
  TODAY = 'TODAY',
  DATE = 'DATE',
}

type CustomCalendarHeaderViewProps = ToolbarProps & {
  date: Date;
  onNavigate: (action: NAVIGATE_ACTION, date: Date) => void;
  isFilterShown: boolean;
  isSaveEventEnabled: boolean;
  isAddEventModalOpened: boolean;
  onClickFilterClose: () => void;
  onChangeIsMy: (value: boolean) => void;
  onChangeMonthItem: (month: number) => void;
  onChangeYearItem: (year: number) => void;
  onClickFilter: () => void;
  onClickAddEvent: () => void;
  onClickCancelAddEvent: () => void;
  onClickSaveEvent: () => void;
};

const CustomCalendarHeaderView = ({
  date,
  onNavigate,
  isFilterShown,
  isSaveEventEnabled,
  isAddEventModalOpened,
  onClickFilterClose,
  onChangeIsMy,
  onChangeMonthItem,
  onChangeYearItem,
  onClickFilter,
  onClickAddEvent,
  onClickCancelAddEvent,
  onClickSaveEvent,
}: CustomCalendarHeaderViewProps) => {
  const params = useParams();
  const locale = params.locale as string;

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const thisYear = new Date().getFullYear();

  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );

  const yearDropdownItems = Array.from({ length: 11 }, (_, i) => {
    const year = thisYear - 5 + i;
    return {
      value: year,
      title: `${year}`,
    };
  });

  const monthDropdownItems = Array.from({ length: 12 }, (_, i) => {
    return {
      value: i,
      title:
        locale === LOCALE.EN ? getShortEnglishMonthName(i + 1) : `${i + 1}`,
    };
  });

  return (
    <HeaderContainer>
      <LeftContainer>
        {/* 지난달 */}
        <Button
          icon={
            <SvgIcon svg={Svg.ChevronLeft} width={2} cursor={CURSOR.POINTER} />
          }
          width={30}
          height={30}
          borderColor={WHITE}
          backgroundColor={WHITE}
          onClick={() => onNavigate(NAVIGATE_ACTION.PREV)}
        />

        {/* 날짜 타이틀*/}
        <TitleContainer $isKO={locale === LOCALE.KO}>
          {/* 월 */}
          <DropdownContainer>
            <Dropdown
              value={date.getMonth()}
              items={monthDropdownItems}
              onChangeItem={onChangeMonthItem}
              width={locale === LOCALE.KO ? 50 : 90}
              borderColor={WHITE}
              isChevronShown={false}
              fontSize={24}
              fontWeight={600}
              isRight={locale === LOCALE.KO}
            />
            {locale === LOCALE.KO && (
              <MainText fontSize={22} fontWeight={700}>
                {'월'}
              </MainText>
            )}
          </DropdownContainer>
          {/* 년 */}
          <DropdownContainer>
            <Dropdown
              value={date.getFullYear()}
              items={yearDropdownItems}
              onChangeItem={onChangeYearItem}
              width={80}
              borderColor={WHITE}
              isChevronShown={false}
              fontSize={24}
              fontWeight={600}
              isRight={locale === LOCALE.KO}
            />
            {locale === LOCALE.KO && (
              <MainText fontSize={22} fontWeight={700}>
                {'년'}
              </MainText>
            )}
          </DropdownContainer>
        </TitleContainer>
        {/* 다음달 */}
        <Button
          icon={
            <SvgIcon svg={Svg.ChevronRight} width={2} cursor={CURSOR.POINTER} />
          }
          width={30}
          height={30}
          borderColor={WHITE}
          backgroundColor={WHITE}
          onClick={() => onNavigate(NAVIGATE_ACTION.NEXT)}
        />
        {/* 오늘 */}
        <Button
          text={t_button('today')}
          width={60}
          height={30}
          color={GRAY.DARK}
          borderColor={GRAY.LIGHT}
          backgroundColor={WHITE}
          onClick={() => onNavigate(NAVIGATE_ACTION.TODAY)}
        />
      </LeftContainer>
      <RightContainer>
        <ButtonContainer>
          {/* 나의 일정만 보기 */}
          <ToggleContainer>
            <MainText color={GRAY.DARK}>{t_button('mySchedule')}</MainText>
            <ToggleButton
              value={calendarFilter.isMy}
              onClick={() => onChangeIsMy(!calendarFilter.isMy)}
            />
          </ToggleContainer>
          {/* 도메인 필터 버튼 */}
          <Button
            text={t('filter')}
            icon={<SvgIcon svg={Svg.FilterOutline} />}
            width={'auto'}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.LIGHT}
            backgroundColor={WHITE}
            onClick={onClickFilter}
          />
          {/* 이벤트 추가 버튼 */}
          <Button
            text={t_button('addChurchEvent')}
            width={'auto'}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.LIGHT}
            backgroundColor={WHITE}
            onClick={onClickAddEvent}
          />
          {/* 도메인 필터 팝업 */}
          <FilterContainer $isShown={isFilterShown}>
            <TransparentBackground
              isOpened={isFilterShown}
              onClick={onClickFilterClose}
              blur={false}
              zIndex={49}
            />
            <DomainFilter />
          </FilterContainer>
          {/* 일정 추가 팝업 */}
          <CustomPopup
            isShow={isAddEventModalOpened}
            onClickCancel={onClickCancelAddEvent}
            headerTitle={t_title('addChurchEvent')}
            width={500}
            height={500}
            onClickDone={onClickSaveEvent}
            doneBackgroundColor={isSaveEventEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
            doneDisabled={!isSaveEventEnabled}
            cancelText={t_button('cancel')}
            doneText={t_button('save')}
          >
            <AddChurchEvent />
          </CustomPopup>
        </ButtonContainer>
      </RightContainer>
    </HeaderContainer>
  );
};

export default CustomCalendarHeaderView;
