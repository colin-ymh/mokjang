import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMemberFilter } from '@/redux/reducers/member-filter-reducer';

import GroupFilterView from '@/components/atoms/layout/side/main-side/group-filter.view';
import { Group } from '@/models/management/management';
import { getOrderedGroups } from '@/utils/group';
import { useI18n } from '../../../../../../locales/client';

const GroupFilter = () => {
  const t = useI18n();
  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const dispatch = useDispatch<AppDispatch>();
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter
  );

  // 전체 그룹 배열
  const [orderedGroups, setOrderedGroups] = useState<Group[]>([]);
  // 선택된 그룹 id
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  // 선택된 그룹 + 모든 자식 그룹들의 id
  const [groupIds, setGroupIds] = useState<string[]>([]);

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (groups) {
      // 최상단에 "전체" 그룹을 추가
      const allGroup: Group = {
        id: null, // 고유 ID (임의로 0으로 설정)
        name: t('all'),
        parentGroupId: null,
        childGroups: getOrderedGroups(groups), // 모든 그룹을 하위 그룹으로 설정
        membersCount: 0,
        churchId,
        childGroupIds: [],
        roles: [],
      };

      setOrderedGroups([allGroup]);
    }
  }, [groups]);

  // 새로운 그룹을 설정
  const onClickGroup = (groupIds: string[]) => {
    setSelectedGroupId(groupIds[0]);
    setGroupIds(groupIds);
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
