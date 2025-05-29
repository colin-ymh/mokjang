import { ChangeEvent, KeyboardEventHandler, Ref } from 'react';
import styled from 'styled-components';

import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { BLACK, GRAY } from '@/constants/styles/color';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

import { useScopedI18n } from '../../../../../locales/client';
import Search from '../../../../../public/svg/search.svg';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const InputContainer = styled.input`
  width: 150px;
  height: 32px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  color: ${BLACK};
  transition: all 0.3s ease;
  border: 1px solid ${GRAY.LIGHT};
  border-right: 0;
  border-left: 0;
  outline: none;
`;

const SearchButton = styled.div`
  display: flex;
  height: 30px;
  width: 40px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${GRAY.LIGHT};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  flex-shrink: 0;
`;

const SearchIcon = styled(Search)`
  width: 20px;
  height: 20px;
  stroke: ${GRAY.DARK};
  stroke-width: 1.5px;
  cursor: pointer;
`;

type SearchInputProps = {
  searchRef: Ref<HTMLInputElement>;
  searchFilter: any;
  searchFilterDropdownItems: DropdownValueType[];
  onClickSearchFilterItem: (value: any) => void;
  searchValue: string;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClickSearch: () => void;
};

const SearchInput = ({
  searchRef,
  searchFilter,
  searchFilterDropdownItems,
  onClickSearchFilterItem,
  searchValue,
  onChangeSearchValue,
  onKeyDown,
  onClickSearch,
}: SearchInputProps) => {
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <SearchContainer>
      <Dropdown
        value={searchFilter}
        items={searchFilterDropdownItems}
        onChangeItem={onClickSearchFilterItem}
        height={32}
        width={100}
        borderColor={GRAY.LIGHT}
        backgroundBlur={false}
        borderTopRightRadius={0}
        borderBottomRightRadius={0}
      />
      <InputContainer
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        onKeyDown={onKeyDown}
        placeholder={t_placeholder('search')}
      />
      <SearchButton onClick={onClickSearch}>
        <SearchIcon />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchInput;
