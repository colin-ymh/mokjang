import { RefObject } from 'react';
import { GroupHistory } from '@/models/member/history';
import styled from 'styled-components';
import GroupHistoryItem from '@/components/atoms/member/history/group-history-item';

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type GroupHistoryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  histories: GroupHistory[];
};

const GroupHistoryListView = ({
  scrollRef,
  histories,
}: GroupHistoryListViewProps) => {
  return (
    <HistoryList ref={scrollRef}>
      {histories.map((history) => (
        <GroupHistoryItem key={history.id} history={history} />
      ))}
    </HistoryList>
  );
};

export default GroupHistoryListView;
