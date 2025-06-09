import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GroupRangeFilterView from '@/components/atoms/church-user/information/group-range-filter.view';
import { Group } from '@/models/management/management';

type GroupRangeFilterProps = {
  isDefaultOpen?: boolean;
  onChange: (groupIds: (string | null)[]) => void;
};

const GroupRangeFilter = ({
  isDefaultOpen = true,
  onChange,
}: GroupRangeFilterProps) => {
  const { groups } = useSelector((state: RootState) => state.church);

  // 선택된 그룹 id
  const [selectedGroupIds, setSelectedGroupIds] = useState<(string | null)[]>(
    []
  );

  const getGroupIds = (group: Group): string[] => {
    // 재귀적으로 현재 그룹과 모든 하위 그룹의 ID를 수집
    let collectedIds: string[] = [group.id as string]; // 본인 그룹의 ID 추가
    if (group.childGroups && group.childGroups.length > 0) {
      group.childGroups.forEach((child) => {
        collectedIds = collectedIds.concat(getGroupIds(child)); // 하위 그룹의 자식들도 재귀적으로 추가
      });
    }
    return collectedIds;
  };

  // 새로운 그룹을 설정
  const onClickGroup = (group: Group) => {
    let newSelectedGroupIds: (string | null)[];

    if (selectedGroupIds.includes(group.id)) {
      // 선택 해제
      newSelectedGroupIds = selectedGroupIds.filter((id) => id !== group.id);
    } else {
      // 선택 추가
      const childIdsToRemove = getGroupIds(group);

      newSelectedGroupIds = [
        ...selectedGroupIds.filter(
          (id) => !childIdsToRemove.includes(id ?? '')
        ),
        group.id,
      ];
    }

    setSelectedGroupIds(newSelectedGroupIds);
  };

  useEffect(() => {
    onChange(selectedGroupIds);
  }, [selectedGroupIds]);

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
