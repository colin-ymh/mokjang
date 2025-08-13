import { useState } from 'react';
import { HISTORY } from '@/constants/constant';
import MemberHistoryListView from '@/components/molecules/member/information/history/member-history-list.view';

type MemberHistoryListProps = {};

const MemberHistoryList = ({}: MemberHistoryListProps) => {
  const [historyDomain, setHistoryDomain] = useState<HISTORY>(HISTORY.GROUP);

  const onChangeHistoryDomain = (domain: HISTORY) => {
    setHistoryDomain(domain);
  };

  const props = {
    historyDomain,
    onChangeHistoryDomain,
  };

  return (
    <>
      <MemberHistoryListView {...props} />
    </>
  );
};

export default MemberHistoryList;
