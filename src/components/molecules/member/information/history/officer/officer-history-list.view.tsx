import { RefObject } from 'react';
import { OfficerHistory } from '@/models/member/history';
import styled from 'styled-components';
import OfficerHistoryItem from '@/components/atoms/member/history/officer-history-item';
import useWindowSize from '@/hooks/window/window';

const HistoryList = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type OfficerHistoryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  histories: OfficerHistory[];
  onClickOfficerOpen: (history: OfficerHistory) => void;
};

const OfficerHistoryListView = ({
  scrollRef,
  histories,
  onClickOfficerOpen,
}: OfficerHistoryListViewProps) => {
  const { height } = useWindowSize();

  return (
    <HistoryList ref={scrollRef} height={height - 400}>
      {histories.map((history) => (
        <OfficerHistoryItem
          key={history.id}
          history={history}
          onClickOfficerOpen={onClickOfficerOpen}
        />
      ))}
    </HistoryList>
  );
};

export default OfficerHistoryListView;
