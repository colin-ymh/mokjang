import { EducationHistory } from '@mokjang/models';
import React from 'react';
import EducationHistoryItemView from './education-history-item.view';

type EducationHistoryItemProps = {
  history: EducationHistory;
};

const EducationHistoryItem = ({ history }: EducationHistoryItemProps) => {
  const props = {
    history,
  };

  return (
    <>
      <EducationHistoryItemView {...props} />
    </>
  );
};

export default EducationHistoryItem;
