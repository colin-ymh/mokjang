import { OfficerHistory } from '@mokjang/models';
import React from 'react';
import OfficerHistoryItemView from './officer-history-item.view';

type OfficerHistoryItemProps = {
  history: OfficerHistory;
  onClickOfficerOpen: (history: OfficerHistory) => void;
};

const OfficerHistoryItem = ({
  history,
  onClickOfficerOpen,
}: OfficerHistoryItemProps) => {
  const props = {
    history,
    onClickOfficerOpen,
  };

  return (
    <>
      <OfficerHistoryItemView {...props} />
    </>
  );
};

export default OfficerHistoryItem;
