import { ChangeEvent, KeyboardEventHandler, Ref } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY } from '@/constants/styles/color';

import { useScopedI18n } from '../../../../../locales/client';
import Search from '../../../../../public/svg/search.svg';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InputContainer = styled.input<{ $isLeft: boolean; $inputWidth?: string }>`
  width: ${({ $inputWidth }) => ($inputWidth ? `${$inputWidth}px` : '100%')};
  height: 30px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 10px;
  color: ${BLACK};
  transition: all 0.3s ease;
  border: 1px solid ${GRAY.LIGHT};
  border-right: 0;
  border-left: ${({ $isLeft }) => ($isLeft ? 'auto' : 0)};
  border-top-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  border-bottom-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  outline: none;
`;

const SearchButton = styled.div`
  display: flex;
  height: 28px;
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
  searchValue: string;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClickSearch: () => void;
  placeholder?: string;
  inputWidth?: string;
};

const SearchInput = ({
  searchRef,
  searchValue,
  onChangeSearchValue,
  onKeyDown,
  onClickSearch,
  placeholder,
  inputWidth,
}: SearchInputProps) => {
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <SearchContainer>
      <InputContainer
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder || t_placeholder('search')}
        $inputWidth={inputWidth}
        $isLeft={true}
      />
      <SearchButton onClick={onClickSearch}>
        <SearchIcon />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchInput;
