import { RefObject } from 'react';
import { GroupHistory } from '@/models/member/history';
import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryItem = styled.div`
  display: flex;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
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
        <HistoryItem key={history.id} />
      ))}
    </HistoryList>
  );
};

export default GroupHistoryListView;
