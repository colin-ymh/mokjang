import styled from 'styled-components';

import { useScopedI18n } from '../../../../../../locales/client';
import React from 'react';
import { HISTORY } from '@mokjang/constants';
import { useHistoryDomainDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import Dropdown from '../../../../atoms/common/dropdown/dropdown';
import GroupHistoryList from './group/group-history-list';
import MinistryHistoryList from './ministry/ministry-history-list';
import OfficerHistoryList from './officer/officer-history-list';
import EducationHistoryList from './education/education-history-list';

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
      {/* 이력 헤더 */}
      <HeaderContainer>
        <div />
        <Dropdown
          value={historyDomain}
          items={dropdownItems}
          onChangeItem={onChangeHistoryDomain}
          height={30}
          width={100}
        />
      </HeaderContainer>
      {/* 이력 목록 */}
      <HistoryList>
        {historyDomain === HISTORY.GROUP && <GroupHistoryList />}
        {historyDomain === HISTORY.MINISTRY && <MinistryHistoryList />}
        {historyDomain === HISTORY.OFFICER && <OfficerHistoryList />}
        {historyDomain === HISTORY.EDUCATION && <EducationHistoryList />}
      </HistoryList>
    </MemberHistoryContainer>
  );
};

export default MemberHistoryListView;
