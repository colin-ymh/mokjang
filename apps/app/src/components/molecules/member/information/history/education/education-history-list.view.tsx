import { RefObject } from 'react';
import { EducationHistory } from '../../../../../../models/member/history';
import styled from 'styled-components';
import EducationHistoryItem from '../../../../../atoms/member/history/education-history-item';
import useWindowSize from '../../../../../../hooks/window/window';

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
      {histories.map((history) => (
        <EducationHistoryItem key={history.id} history={history} />
      ))}
    </HistoryList>
  );
};

export default EducationHistoryListView;
