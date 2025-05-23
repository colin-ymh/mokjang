import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { GRAY, WHITE } from '@/constants/styles/color';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import BorderInput from '@/components/atoms/common/input/border-input';
import { EDUCATION } from '@/constants/education/education-column';

import { useEducationSearchFilterDropdownItems } from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import EducationFilteredItem, {
  EducationFilteredItemType,
} from '@/components/atoms/education/education/education-filtered-item';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

const EducationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100px;
  flex-shrink: 0;
  position: relative;
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
`;

const RowBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 10px 20px;
`;

const FilterList = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 10px 10px 20px;
  position: relative;
`;

const FilteredItemList = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
  padding: 10px 0;
  width: ${({ $width }) => $width}px;
  overflow-x: scroll;
`;

const SearchContainer = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  right: 20px;
  position: absolute;
`;

const AddFilterContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  position: absolute;

  z-index: 60;
  background-color: white;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;

  top: 50px;
  left: 10px;
`;

export type EDUCATION_SEARCH_FILTER = EDUCATION.NAME;

type EducationViewProps = {
  searchFilter: EDUCATION_SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: EducationFilteredItemType[];
  onClickSearchFilterItem: (value: EDUCATION_SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const EducationRowView = ({
  searchFilter,
  searchValue,
  searchRef,
  filteredItems,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
}: EducationViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const t_button = useScopedI18n('button');
  const searchFilterDropdownItems = useEducationSearchFilterDropdownItems();

  const { educationFilter } = useSelector(
    (state: RootState) => state.educationFilter
  );

  const { width } = useWindowSize();

  return (
    <EducationContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer></ButtonContainer>
          {/* 필터 설정된 값들 */}
          <FilteredItemList $width={width - 650}>
            {filteredItems.map((item) => (
              <EducationFilteredItem key={item.title} item={item} />
            ))}
          </FilteredItemList>
        </FilterList>
        {/* 검색 부분 */}
        <SearchContainer>
          <Dropdown
            value={searchFilter}
            items={searchFilterDropdownItems}
            onChangeItem={onClickSearchFilterItem}
            height={30}
            width={100}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundBlur={false}
          />
          <BorderInput
            ref={searchRef}
            value={searchValue}
            onChange={onChangeSearchValue}
            borderColor={GRAY.SEMI_LIGHT}
            height={30}
            width={160}
            onKeyDown={onKeyDown}
            placeholder={t_placeholder('search')}
          />
          <Button
            text={t('search')}
            height={30}
            width={'auto'}
            onClick={onClickSearch}
            backgroundColor={WHITE}
            borderColor={GRAY.DEFAULT}
            color={GRAY.DARK}
          />
        </SearchContainer>
      </RowTop>
    </EducationContainer>
  );
};

export default EducationRowView;
