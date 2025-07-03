import { ToolbarProps } from 'react-big-calendar';
import Button from '@/components/atoms/common/button/button';
import styled from 'styled-components';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { useScopedI18n } from '../../../locales/client';
import { useParams } from 'next/navigation';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { LOCALE } from '@/constants/state/locale';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getShortEnglishMonthName } from '@/utils/format';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import DomainFilter from '@/vendor/calendar/domain-filter';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  margin-bottom: 10px;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const TitleContainer = styled.div<{ $isKO: boolean }>`
  display: flex;
  gap: 10px;
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
  gap: 5px;
  flex-direction: row;
  position: relative;
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
  isFilterShown: boolean;
  onClickFilterClose: () => void;
  onChangeIsMy: (value: boolean) => void;
  onChangeMonthItem: (month: number) => void;
  onChangeYearItem: (year: number) => void;
  onClickFilter: () => void;
  onNavigate: (action: NAVIGATE_ACTION, date: Date) => void;
};

const CustomCalendarHeaderView = ({
  date,
  isFilterShown,
  onClickFilterClose,
  onChangeIsMy,
  onChangeMonthItem,
  onChangeYearItem,
  onClickFilter,
  onNavigate,
}: CustomCalendarHeaderViewProps) => {
  const params = useParams();
  const locale = params.locale as string;
  const t_button = useScopedI18n('button');

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
        <TitleContainer $isKO={locale === LOCALE.KO}>
          <DropdownContainer>
            <Dropdown
              value={date.getMonth()}
              items={monthDropdownItems}
              onChangeItem={onChangeMonthItem}
              width={locale === LOCALE.KO ? 70 : 100}
              borderColor={WHITE}
              isChevronShown={false}
              fontSize={30}
              fontWeight={600}
              isRight={locale === LOCALE.KO}
            />
            {locale === LOCALE.KO && (
              <MainText fontSize={20} fontWeight={600}>
                {'월'}
              </MainText>
            )}
          </DropdownContainer>
          <DropdownContainer>
            <Dropdown
              value={date.getFullYear()}
              items={yearDropdownItems}
              onChangeItem={onChangeYearItem}
              width={100}
              borderColor={WHITE}
              isChevronShown={false}
              fontSize={30}
              fontWeight={600}
              isRight={locale === LOCALE.KO}
            />
            {locale === LOCALE.KO && (
              <MainText fontSize={20} fontWeight={600}>
                {'년'}
              </MainText>
            )}
          </DropdownContainer>
        </TitleContainer>
        <ButtonContainer>
          <Button
            text={t_button('today')}
            width={60}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={WHITE}
            onClick={() => onNavigate(NAVIGATE_ACTION.TODAY)}
          />
          <Button
            text={'<'}
            width={30}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={WHITE}
            onClick={() => onNavigate(NAVIGATE_ACTION.PREV)}
          />
          <Button
            text={'>'}
            width={30}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={WHITE}
            onClick={() => onNavigate(NAVIGATE_ACTION.NEXT)}
          />
        </ButtonContainer>
      </LeftContainer>
      <RightContainer>
        <ButtonContainer>
          {/* 나의 일정만 보기 */}
          <Button
            text={t_button('my')}
            width={100}
            height={30}
            color={calendarFilter.isMy ? WHITE : GRAY.DARK}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={calendarFilter.isMy ? MAIN.DEFAULT : WHITE}
            onClick={() => onChangeIsMy(!calendarFilter.isMy)}
          />
          {/* 도메인 필터 버튼 */}
          <Button
            text={'필터'}
            width={50}
            height={30}
            color={GRAY.DARK}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={WHITE}
            onClick={onClickFilter}
          />
          <FilterContainer $isShown={isFilterShown}>
            <TransparentBackground
              isOpened={isFilterShown}
              onClick={onClickFilterClose}
              blur={false}
            />
            {isFilterShown && <DomainFilter />}
          </FilterContainer>
        </ButtonContainer>
      </RightContainer>
    </HeaderContainer>
  );
};

export default CustomCalendarHeaderView;
