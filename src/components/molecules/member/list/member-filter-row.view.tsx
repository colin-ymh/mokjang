import { ChangeEvent, Dispatch, Ref, SetStateAction } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { GRAY } from '@/constants/styles/color';
import TableSetting from '@/components/molecules/member/list/table-setting';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import BorderInput from '@/components/atoms/common/input/border-input';
import { MEMBER } from '@/constants/member/member-column';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import FilteredItem, {
  FilteredItemType,
} from '@/components/atoms/member/list/filtered-item';
import { useSearchFilterDropdownItems } from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';

import { useI18n, useScopedI18n } from '../../../../../locales/client';

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
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

export type SEARCH_FILTER =
  | MEMBER.NAME
  | MEMBER.SCHOOL
  | MEMBER.VEHICLE_NUMBER
  | MEMBER.HOME_PHONE
  | MEMBER.MOBILE_PHONE
  | MEMBER.OCCUPATION
  | MEMBER.ADDRESS;

type MemberFilterViewProps = {
  isAddFilterShown: boolean;
  searchFilter: SEARCH_FILTER;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  filteredItems: FilteredItemType[];
  setIsAddFilterShown: Dispatch<SetStateAction<boolean>>;
  onClickSearchFilterItem: (value: SEARCH_FILTER) => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickTableSetting: () => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const MemberFilterRowView = ({
  isAddFilterShown,
  searchFilter,
  searchValue,
  searchRef,
  filteredItems,
  setIsAddFilterShown,
  onClickTableSetting,
  onClickSearchFilterItem,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
}: MemberFilterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const t_button = useScopedI18n('button');
  const searchFilterDropdownItems = useSearchFilterDropdownItems();

  const { width } = useWindowSize();
  return (
    <MemberFilterContainer>
      <FilterList>
        <ButtonContainer>
          {/* 설정 활성화 버튼 */}
          <Button
            text={t_button('filterSetting')}
            height={30}
            onClick={onClickTableSetting}
          />
          {/* 설정 모달 */}
          <AddFilterContainer $isShown={isAddFilterShown}>
            <TransparentBackground
              isOpened={isAddFilterShown}
              onClick={() => setIsAddFilterShown(false)}
              blur={false}
            />
            {isAddFilterShown && (
              <TableSetting setIsShown={setIsAddFilterShown} />
            )}
          </AddFilterContainer>
        </ButtonContainer>
        {/* 필터 설정된 값들 */}
        <FilteredItemList $width={width - 650}>
          {filteredItems.map((item) => (
            <FilteredItem key={item.title} item={item} />
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
          borderColor={GRAY.LIGHT}
          backgroundBlur={false}
        />
        <BorderInput
          ref={searchRef}
          value={searchValue}
          onChange={onChangeSearchValue}
          borderColor={GRAY.LIGHT}
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
        />
      </SearchContainer>
    </MemberFilterContainer>
  );
};

export default MemberFilterRowView;
