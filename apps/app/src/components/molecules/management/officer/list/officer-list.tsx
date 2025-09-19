import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import OfficerListView from './officer-list.view';
import { Officer } from '@mokjang/models';

type OfficerListProps = {
  selectedOfficerId: string;
  onClickOfficer: (officer: Officer) => void;
  height: number;
};

const OfficerList = ({
  selectedOfficerId,
  onClickOfficer,
  height,
}: OfficerListProps) => {
  const { officers } = useSelector((state: RootState) => state.church);

  const props = {
    officers,
    selectedOfficerId,
    onClickOfficer,
    height,
  };

  return (
    <>
      <OfficerListView {...props} />
    </>
  );
};

export default OfficerList;
