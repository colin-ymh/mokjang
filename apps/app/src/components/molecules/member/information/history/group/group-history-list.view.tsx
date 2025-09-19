import { RefObject } from 'react';
import { GroupHistory } from '@mokjang/models';
import styled from 'styled-components';
import GroupHistoryItem from '../../../../../atoms/member/history/group-history-item';
import useWindowSize from '../../../../../../hooks/window/window';
import EmptyList from '@/components/atoms/common/image/empty-list';

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
  onClickGroupOpen: (history: GroupHistory) => void;
};

const GroupHistoryListView = ({
  scrollRef,
  histories,
  onClickGroupOpen,
}: GroupHistoryListViewProps) => {
  const { height } = useWindowSize();

  return (
    <HistoryList ref={scrollRef} height={height - 400}>
      {histories.length > 0 ? (
        histories.map((history) => (
          <GroupHistoryItem
            key={history.id}
            history={history}
            onClickGroupOpen={onClickGroupOpen}
          />
        ))
      ) : (
        <EmptyList width={200} height={200} />
      )}
    </HistoryList>
  );
};

export default GroupHistoryListView;
