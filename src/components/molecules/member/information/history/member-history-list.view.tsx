import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';

import { useScopedI18n } from '../../../../../../locales/client';
import React from 'react';
import { SIZE } from '@/constants/styles/style';
import { HISTORY } from '@/constants/constant';
import { useHistoryDomainDropdownItems } from '@/hooks/dropdown/dropdown-items';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import GroupHistoryList from '@/components/molecules/member/information/history/group-history-list';

const MemberHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

type MemberHistoryListViewProps = {
  historyDomain: HISTORY;
  onChangeHistoryDomain: (domain: HISTORY) => void;
};

const MemberHistoryListView = ({
  historyDomain,
  onChangeHistoryDomain,
}: MemberHistoryListViewProps) => {
  const t_header = useScopedI18n('header');

  const dropdownItems = useHistoryDomainDropdownItems();

  return (
    <MemberHistoryContainer>
      {/* 가족정보 헤더 */}
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE}>{t_header('history')}</MainText>
        <Dropdown
          value={historyDomain}
          items={dropdownItems}
          onChangeItem={onChangeHistoryDomain}
          height={30}
          width={100}
        />
      </HeaderContainer>
      <HistoryList>
        {historyDomain === HISTORY.GROUP && <GroupHistoryList />}
      </HistoryList>
    </MemberHistoryContainer>
  );
};

export default MemberHistoryListView;
