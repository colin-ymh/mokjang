import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import OfficerListView from '@/components/molecules/management/officer/list/officer-list.view';
import { Officer } from '@/models/management/management';

type OfficerListProps = {
  selectedOfficerId: string;
  onClickOfficer: (officer: Officer) => void;
};

const OfficerList = ({
  selectedOfficerId,
  onClickOfficer,
}: OfficerListProps) => {
  const { officers } = useSelector((state: RootState) => state.church);

  const props = {
    officers,
    selectedOfficerId,
    onClickOfficer,
  };

  return (
    <>
      <OfficerListView {...props} />
    </>
  );
};

export default OfficerList;
