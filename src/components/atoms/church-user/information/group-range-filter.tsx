import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GroupRangeFilterView from '@/components/atoms/church-user/information/group-range-filter.view';
import { Group } from '@/models/management/management';

type GroupRangeFilterProps = {
  isDefaultOpen?: boolean;
  selectedGroupIds: (string | null)[];
  onClickGroup: (group: Group) => void;
};

const GroupRangeFilter = ({
  isDefaultOpen = true,
  selectedGroupIds,
  onClickGroup,
}: GroupRangeFilterProps) => {
  const { groups } = useSelector((state: RootState) => state.church);

  const props = {
    groups,
    isDefaultOpen,
    selectedGroupIds,
    onClickGroup,
  };

  return (
    <>
      <GroupRangeFilterView {...props} />
    </>
  );
};

export default GroupRangeFilter;
