import { ChangeEvent, KeyboardEventHandler, Ref } from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN } from '@mokjang/constants';
import { useScopedI18n } from '../../../../../locales/client';
import { SvgIcon } from '@mokjang/components';
import { Svg } from '@mokjang/assets';

type SearchInputProps = {
  searchRef: Ref<HTMLInputElement>;
  searchValue: string;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClickSearch: () => void;
  placeholder?: string;
  inputWidth?: number | string; // ✅ 숫자/문자열 모두 허용
  height?: number; // ✅ 전체 높이 컨트롤(컨테이너 기준)
  color?: string;
};

const SearchContainer = styled.div<{
  $height: number;
  $inputWidth?: number | string;
}>`
  display: inline-flex;
  align-items: stretch;
  width: ${({ $inputWidth }) =>
    $inputWidth != null
      ? typeof $inputWidth === 'number'
        ? `${$inputWidth}px`
        : $inputWidth
      : '100%'};
  height: ${({ $height }) => `${$height}px`};

  /* 포커스 시 input만 강조 */
  &:focus-within input {
    border-color: ${MAIN.DEFAULT};
  }

  &:focus-within button {
    border-color: ${MAIN.DEFAULT};
    /* box-shadow는 그대로 GRAY 유지 → 내부 경계선은 변하지 않음 */
  }
`;

const InputContainer = styled.input<{ $isLeft: boolean }>`
  flex: 1 1 auto;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  padding: 0 10px;
  color: ${BLACK};
  transition: border-color 0.2s ease;
  border: 1px solid ${GRAY.LIGHT};
  border-right: 0;
  border-top-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  border-bottom-left-radius: ${({ $isLeft }) => ($isLeft ? '5px' : 0)};
  outline: none;
  line-height: normal;
`;

const SearchButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid ${GRAY.LIGHT};
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  flex-shrink: 0;
  cursor: pointer;
  background: transparent;
  transition: border-color 0.2s ease;

  /* 내부 경계선은 항상 GRAY */
  box-shadow: inset 1px 0 0 ${GRAY.LIGHT};
`;

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

  // 전체 높이 기본값(컨테이너 기준)
  const H = height ?? 30;
  const iconSize = Math.max(14, Math.min(28, Math.round(H * 0.6))); // 높이 60% 비율, 14~28 클램프

  return (
    <SearchContainer $height={H} $inputWidth={inputWidth}>
      <InputContainer
        ref={searchRef}
        value={searchValue}
        onChange={onChangeSearchValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder || t_placeholder('search')}
        $isLeft={true}
      />
      <SearchButton onClick={onClickSearch} aria-label="search">
        <SvgIcon svg={Svg.Search} size={iconSize} color={color} />
      </SearchButton>
    </SearchContainer>
  );
};

export default SearchInput;
