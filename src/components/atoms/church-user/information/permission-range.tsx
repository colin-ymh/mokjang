import styled from 'styled-components';
import SearchInput from '@/components/atoms/common/input/search-input';
import { ChangeEvent, useRef, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { useI18n } from '../../../../../locales/client';
import GroupRangeFilter from '@/components/atoms/church-user/information/group-range-filter';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';

const PermissionRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  overflow-y: auto;
`;

type PermissionRangeProps = {
  selectedGroupIds: (string | null)[];
  onChange: (groupIds: (string | null)[]) => void;
};

const PermissionRange = ({
  selectedGroupIds,
  onChange,
}: PermissionRangeProps) => {
  const t = useI18n();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const onClickSearch = () => {};

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  return (
    <PermissionRangeContainer>
      <SearchInput
        searchRef={searchRef}
        searchValue={searchValue}
        onChangeSearchValue={onChangeSearchValue}
        onKeyDown={onKeyDown}
        onClickSearch={onClickSearch}
        placeholder={t('placeholder.groupName')}
      />
      <MainText
        color={GRAY.SEMI_DARK}
      >{`${selectedGroupIds.length}개 선택됨`}</MainText>
      <GroupContainer>
        <GroupRangeFilter onChange={onChange} />
      </GroupContainer>
    </PermissionRangeContainer>
  );
};

export default PermissionRange;
