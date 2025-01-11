import { Dispatch, SetStateAction } from 'react';

import { Officer } from '@/models/management/management';
import OfficerListView from '@/components/molecules/management/officer/officer-list.view';

type OfficerListProps = {
  officers: Officer[];
  fetchOfficers: () => void;
  selectedOfficerId: string | null;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
};

const OfficerList = ({
  officers,
  fetchOfficers,
  selectedOfficerId,
  setSelectedOfficer,
}: OfficerListProps) => {
  const props = {
    officers,
    selectedOfficerId,
    setSelectedOfficer,
    fetchOfficers,
  };
  return (
    <>
      <OfficerListView {...props} />
    </>
  );
};

export default OfficerList;
