import { Dispatch, SetStateAction } from 'react';

import { Officer } from '@/models/management/management';
import OfficerListView from '@/components/molecules/management/officer/officer-list.view';

type OfficerListProps = {
  officers: Officer[];
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
};

const OfficerList = ({
  officers,
  selectedOfficerId,
  setSelectedOfficer,
}: OfficerListProps) => {
  const props = {
    officers,
    selectedOfficerId,
    setSelectedOfficer,
  };
  return (
    <>
      <OfficerListView {...props} />
    </>
  );
};

export default OfficerList;
