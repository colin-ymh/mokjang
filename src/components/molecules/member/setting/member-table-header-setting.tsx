import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  setMemberFilter,
  setMemberTableHeaderItemList,
} from '@/redux/reducers/filter/member-filter-reducer';

import MemberTableHeaderSettingView from '@/components/molecules/member/setting/member-table-header-setting.view';

type AddFilterProps = {};

const MemberTableHeaderSetting = ({}: AddFilterProps) => {
  const { memberTableHeaderItemList, memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const dispatch = useDispatch<AppDispatch>();

  // 칼럼들을 드래그하여 순서 변경
  const onDrop = (fromIndex: number, toIndex: number) => {
    if (toIndex < 2) return;
    if (fromIndex === toIndex) return;

    const updatedHeaders = [...memberTableHeaderItemList];
    const [movedItem] = updatedHeaders.splice(fromIndex, 1);
    updatedHeaders.splice(toIndex, 0, movedItem);

    // Redux 상태 갱신
    dispatch(setMemberTableHeaderItemList(updatedHeaders));

    // selectedColumns 재정렬 반영
    const selectedColumns = updatedHeaders
      .filter((item) => item.isShown)
      .map((item) => item.id);

    dispatch(
      setMemberFilter({
        ...memberFilter,
        selectedColumns,
      })
    );
  };

  const props = {
    onDrop,
  };

  return (
    <>
      <MemberTableHeaderSettingView {...props} />
    </>
  );
};

export default MemberTableHeaderSetting;
