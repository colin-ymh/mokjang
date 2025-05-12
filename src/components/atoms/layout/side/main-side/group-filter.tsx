import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/member-filter-reducer';

import GroupFilterView from '@/components/atoms/layout/side/main-side/group-filter.view';
import { DEFAULT_GROUP } from '@/models/management/management';
import { setTargetGroup } from '@/redux/reducers/target-group-reducer';

type GroupFilterProps = {
  isDefaultOpen?: boolean;
  onClick?: (id: string | null) => void;
};

const GroupFilter = ({ isDefaultOpen = false, onClick }: GroupFilterProps) => {
  const { groups } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter
  );

  // 선택된 그룹 id
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  // 선택된 그룹 + 모든 자식 그룹들의 id
  const [groupIds, setGroupIds] = useState<string[]>([]);

  // 새로운 그룹을 설정
  const onClickGroup = (groupIds: string[]) => {
    setSelectedGroupId(groupIds[0]);
    setGroupIds(groupIds);

    if (onClick) {
      onClick(groupIds[0]);
    }

    if (groupIds[0] !== null) {
      const newGroup = groups.find((group) => group.id === groupIds[0]);
      if (newGroup) {
        dispatch(setTargetGroup(newGroup));
      }
    } else {
      dispatch(setTargetGroup(DEFAULT_GROUP));
    }
  };

  // 그룹이 변경되면 교인 목록에 적용
  useEffect(() => {
    if (groupIds[0] === null) {
      dispatch(setMemberFilter({ ...memberFilter, group: [] }));
    } else if (groupIds) {
      dispatch(setMemberFilter({ ...memberFilter, group: groupIds }));
    }
  }, [groupIds]);

  const props = {
    groups,
    isDefaultOpen,
    selectedGroupId,
    onClickGroup,
  };

  return (
    <>
      <GroupFilterView {...props} />
    </>
  );
};

export default GroupFilter;
