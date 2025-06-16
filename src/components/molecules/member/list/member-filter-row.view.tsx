import { ChangeEvent, Dispatch, Ref, SetStateAction } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import TableSetting from '@/components/molecules/member/list/table-setting';
import { MEMBER } from '@/constants/member/member-column';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';
import FilteredItem, {
  FilteredItemType,
} from '@/components/atoms/member/list/filtered-item';
import { useSearchFilterDropdownItems } from '@/hooks/dropdown/dropdown-items';
import useWindowSize from '@/hooks/window/window';

import { useScopedI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SearchInput from '@/components/atoms/common/input/search-input';

const MemberFilterContainer = styled.div`
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

const MemberCount = styled.div`
  display: flex;
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
  const t_button = useScopedI18n('button');
  const searchFilterDropdownItems = useSearchFilterDropdownItems();

  const { width } = useWindowSize();

  const church = useSelector((state: RootState) => state.church.church);
  const targetGroup = useSelector(
    (state: RootState) => state.targetGroup.targetGroup
  );

  return (
    <MemberFilterContainer>
      <RowTop>
        <FilterList>
          <ButtonContainer>
            {/* 설정 활성화 버튼 */}
            <Button
              text={t_button('filterSetting')}
              height={30}
              width={75}
              onClick={onClickTableSetting}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.DARK}
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
          <SearchInput
            searchRef={searchRef}
            searchFilter={searchFilter}
            searchFilterDropdownItems={searchFilterDropdownItems}
            onClickSearchFilterItem={onClickSearchFilterItem}
            searchValue={searchValue}
            onChangeSearchValue={onChangeSearchValue}
            onKeyDown={onKeyDown}
            onClickSearch={onClickSearch}
          />
        </SearchContainer>
      </RowTop>
      <RowBottom>
        <MemberCount>
          <MainText fontWeight={600}>
            총
            <MainText fontWeight={600} color={MAIN.DEFAULT}>
              {targetGroup.id ? targetGroup.membersCount : church.memberCount}
            </MainText>
            명
          </MainText>
        </MemberCount>
      </RowBottom>
    </MemberFilterContainer>
  );
};

export default MemberFilterRowView;
