import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import { setCalendarFilter } from '@/redux/reducers/filter/calendar-filter-reducer';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useI18n } from '../../../locales/client';
import { DOMAIN } from '@/models/permission/permission';
import { getCalenderBackgroundColor } from '@/utils/color';
import { CURSOR } from '@/constants/styles/style';

const DomainFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  padding: 20px;
  z-index: 50;
  gap: 20px;
`;

const FilterItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Dot = styled.div<{ color: string }>`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: ${({ color }) => color};
`;

const DomainFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();
  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );

  const domainFilterItems: DropdownValueType[] = [
    DOMAIN.TASK,
    DOMAIN.VISITATION,
    DOMAIN.EDUCATION_SESSION,
    DOMAIN.MEMBER,
    DOMAIN.HOLIDAY,
    DOMAIN.CHURCH_EVENT,
  ]
    .filter((domain) => domain !== DOMAIN.MANAGEMENT)
    .map((domain) => {
      if (domain === DOMAIN.MEMBER) {
        return { value: domain, title: t('birthday') };
      }
      return { value: domain, title: t(domain) };
    });

  const onClickCheck = (value: boolean, item: DOMAIN) => {
    if (value) {
      const newDomains = [...calendarFilter.selectedDomains, item];
      dispatch(
        setCalendarFilter({
          ...calendarFilter,
          selectedDomains: newDomains,
        })
      );
    } else {
      const newDomains = calendarFilter.selectedDomains.filter(
        (domain) => domain !== item
      );
      dispatch(
        setCalendarFilter({
          ...calendarFilter,
          selectedDomains: newDomains,
        })
      );
    }
  };

  return (
    <DomainFilterContainer>
      {domainFilterItems.map((item: DropdownValueType) => (
        <FilterItemContainer
          key={item.value}
          onClick={() =>
            onClickCheck(
              !calendarFilter.selectedDomains.includes(item.value),
              item.value
            )
          }
        >
          <CheckButton
            value={calendarFilter.selectedDomains.includes(item.value)}
            onChange={(value) => onClickCheck(value, item.value)}
            isStopPropagation={true}
            width={15}
            height={15}
          />
          <Dot color={getCalenderBackgroundColor(item.value)} />
          <MainText cursor={CURSOR.POINTER}>{item.title}</MainText>
        </FilterItemContainer>
      ))}
    </DomainFilterContainer>
  );
};

export default DomainFilter;
