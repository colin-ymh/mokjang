import { RefObject } from 'react';
import { MinistryHistory } from '@/models/member/history';
import styled from 'styled-components';
import MinistryHistoryItem from '@/components/atoms/member/history/ministry-history-item';
import useWindowSize from '@/hooks/window/window';

const HistoryList = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type MinistryHistoryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  histories: MinistryHistory[];
  onClickMinistryOpen: (history: MinistryHistory) => void;
};

const MinistryHistoryListView = ({
  scrollRef,
  histories,
  onClickMinistryOpen,
}: MinistryHistoryListViewProps) => {
  const { height } = useWindowSize();

  return (
    <HistoryList ref={scrollRef} height={height - 400}>
      {histories.map((history) => (
        <MinistryHistoryItem
          key={history.id}
          history={history}
          onClickMinistryOpen={onClickMinistryOpen}
        />
      ))}
    </HistoryList>
  );
};

export default MinistryHistoryListView;
