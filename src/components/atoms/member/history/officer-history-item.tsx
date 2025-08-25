import { OfficerHistory } from '@/models/member/history';
import React from 'react';
import OfficerHistoryItemView from '@/components/atoms/member/history/officer-history-item.view';

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
