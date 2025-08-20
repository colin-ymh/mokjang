import { RefObject } from 'react';
import { GroupHistory } from '@/models/member/history';
import styled from 'styled-components';
import GroupHistoryItem from '@/components/atoms/member/history/group-history-item';
import useWindowSize from '@/hooks/window/window';

const HistoryList = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type GroupHistoryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  histories: GroupHistory[];
};

const GroupHistoryListView = ({
  scrollRef,
  histories,
}: GroupHistoryListViewProps) => {
  const { height } = useWindowSize();

  return (
    <HistoryList ref={scrollRef} height={height - 400}>
      {histories.map((history) => (
        <GroupHistoryItem key={history.id} history={history} />
      ))}
    </HistoryList>
  );
};

export default GroupHistoryListView;
