import { ChangeEvent, KeyboardEventHandler, Ref } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { useScopedI18n } from '../../../../../locales/client';
import { SvgIcon } from '@mokjang/components';
import { Svg } from '@mokjang/assets';

const InputContainer = styled.input<{
  $isLeft: boolean;
  $inputWidth?: string;
  $height?: number;
}>`
  width: ${({ $inputWidth }) => ($inputWidth ? `${$inputWidth}px` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '30px')};
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 10px;
  color: ${BLACK};
  transition: all 0.2s ease;
  border: 1px solid ${GRAY.LIGHT};
  border-right: 0; /* 오른쪽 경계선은 버튼과 공유 */
  border-left: ${({ $isLeft }) => ($isLeft ? 'auto' : 0)};
  border-top-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  border-bottom-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  outline: none;
`;

const SearchButton = styled.div<{ $height?: number }>`
  display: flex;
  height: ${({ $height }) => ($height ? `${$height}px` : '30px')};
  width: 30px;
  justify-content: center;
  align-items: center;
  border: 1px solid ${GRAY.LIGHT};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  /* ✅ input이 focus되면 container 전체에 스타일 적용 */
  &:focus-within ${InputContainer} {
    border-color: ${MAIN.DEFAULT};
  }

  &:focus-within ${SearchButton} {
    border-color: ${MAIN.DEFAULT};
    border-left-color: ${GRAY.LIGHT}; /* 버튼과 인풋 사이 경계선만 유지 */
  }
`;

type SearchInputProps = {
  searchRef: Ref<HTMLInputElement>;
  searchValue: string;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClickSearch: () => void;
  placeholder?: string;
  inputWidth?: string;
  height?: number; // ✅ 전체 높이 컨트롤
  color?: string;
};

const SearchInput = ({
  searchRef,
  searchValue,
  onChangeSearchValue,
  onKeyDown,
  onClickSearch,
  placeholder,
  inputWidth,
  height,
  color,
}: SearchInputProps) => {
  const t_placeholder = useScopedI18n('placeholder');

  // 전체 높이 기본값 40px
  const H = height ?? 30;
  const iconSize = Math.max(14, Math.min(28, Math.round(H * 0.6))); // 높이 50% 비율, 14~28 클램프

  return (
    <SearchContainer>
      <InputContainer
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder || t_placeholder('search')}
        color={color}
        $inputWidth={inputWidth}
        $isLeft={true}
        $height={H} // ✅ 인풋 높이 적용
      />
      <SearchButton onClick={onClickSearch} $height={H - 1.5}>
        <SvgIcon svg={Svg.Search} size={iconSize} color={color} />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchInput;
