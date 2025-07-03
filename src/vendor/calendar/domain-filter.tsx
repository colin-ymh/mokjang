import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import { setCalendarFilter } from '@/redux/reducers/filter/calendar-filter-reducer';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useI18n } from '../../../locales/client';
import { DOMAIN } from '@/models/permission/permission';

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
  justify-content: space-between;
  cursor: pointer;
`;

const DomainFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();
  const { calendarFilter } = useSelector(
    (state: RootState) => state.calendarFilter
  );

  const domainFilterItems: DropdownValueType[] = Object.values(DOMAIN).map(
    (key) => {
      return { value: key, title: t(key as DOMAIN) };
    }
  );

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
          <MainText>{item.title}</MainText>
          <CheckButton
            value={calendarFilter.selectedDomains.includes(item.value)}
            onChange={(value) => onClickCheck(value, item.value)}
          />
        </FilterItemContainer>
      ))}
    </DomainFilterContainer>
  );
};

export default DomainFilter;
