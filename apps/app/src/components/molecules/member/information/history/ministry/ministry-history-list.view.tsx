import React, { RefObject } from 'react';
import { MinistryHistory } from '@mokjang/models';
import styled from 'styled-components';
import MinistryHistoryItem from '../../../../../atoms/member/history/ministry-history-item';
import useWindowSize from '../../../../../../hooks/window/window';
import EmptyList from '@/components/atoms/common/image/empty-list';

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
      {histories.length > 0 ? (
        histories.map((history) => (
          <MinistryHistoryItem
            key={history.id}
            history={history}
            onClickMinistryOpen={onClickMinistryOpen}
          />
        ))
      ) : (
        <EmptyList size={50} />
      )}
    </HistoryList>
  );
};

export default MinistryHistoryListView;
