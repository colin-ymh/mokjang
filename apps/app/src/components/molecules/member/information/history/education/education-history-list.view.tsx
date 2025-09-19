import React, { RefObject } from 'react';
import { EducationHistory } from '@mokjang/models';
import styled from 'styled-components';
import EducationHistoryItem from '../../../../../atoms/member/history/education-history-item';
import useWindowSize from '../../../../../../hooks/window/window';
import EmptyList from '@/components/atoms/common/image/empty-list';

const HistoryList = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type EducationHistoryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  histories: EducationHistory[];
};

const EducationHistoryListView = ({
  scrollRef,
  histories,
}: EducationHistoryListViewProps) => {
  const { height } = useWindowSize();

  return (
    <HistoryList ref={scrollRef} height={height - 400}>
      {histories.length > 0 ? (
        histories.map((history) => (
          <EducationHistoryItem key={history.id} history={history} />
        ))
      ) : (
        <EmptyList size={50} />
      )}
    </HistoryList>
  );
};

export default EducationHistoryListView;
