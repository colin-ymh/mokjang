import { RefObject } from 'react';
import { OfficerHistory } from '@mokjang/models';
import styled from 'styled-components';
import OfficerHistoryItem from '../../../../../atoms/member/history/officer-history-item';
import useWindowSize from '../../../../../../hooks/window/window';
import EmptyList from '@/components/atoms/common/image/empty-list';

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
      {histories.length > 0 ? (
        histories.map((history) => (
          <OfficerHistoryItem
            key={history.id}
            history={history}
            onClickOfficerOpen={onClickOfficerOpen}
          />
        ))
      ) : (
        <EmptyList width={200} height={200} />
      )}
    </HistoryList>
  );
};

export default OfficerHistoryListView;
