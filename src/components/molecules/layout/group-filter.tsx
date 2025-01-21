import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/member-filter-reducer';

import GroupFilterView from '@/components/molecules/layout/group-filter.view';
import { Group } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import { getOrderedGroups } from '@/utils/group';

const GroupFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groups } = useSelector((state: RootState) => state.church);
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter
  );

  // 전체 그룹 배열
  const [orderedGroups, setOrderedGroups] = useState<Group[]>([]);
  // 선택된 그룹 id
  const [selectedGroupId, setSelectedGroupId] = useState<string>(BLANK);
  // 선택된 그룹 + 모든 자식 그룹들의 id
  const [groupIds, setGroupIds] = useState<string[]>([]);

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (groups) {
      setOrderedGroups(getOrderedGroups(groups));
    }
  }, [groups]);

  // 새로운 그룹을 설정
  const onClickGroup = (groupIds: string[]) => {
    setSelectedGroupId(groupIds[0]);
    setGroupIds(groupIds);
  };

  // 그룹이 변경되면 교인 목록에 적용
  useEffect(() => {
    if (groupIds) {
      dispatch(setMemberFilter({ ...memberFilter, group: groupIds }));
    }
  }, [groupIds]);

  const props = {
    groups: orderedGroups,
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
