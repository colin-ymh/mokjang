import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import ResetFilteredItemView from '@/components/atoms/member/setting/reset-filtered-item.view';
import {
  INITIAL_MEMBER_FILTER,
  setMemberFilter,
} from '@/redux/reducers/filter/member-filter-reducer';

type ResetFilteredItemProps = {};

const ResetFilteredItem = ({}: ResetFilteredItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // 해당 필터 내용 삭제
  const onClickReset = () => {
    dispatch(setMemberFilter(INITIAL_MEMBER_FILTER));
  };

  const props = {
    onClickReset,
  };

  return (
    <>
      <ResetFilteredItemView {...props} />
    </>
  );
};

export default ResetFilteredItem;
