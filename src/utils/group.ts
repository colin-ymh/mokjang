/**
 * 계층 구조에 따라 그룹을 정렬하는 함수
 */
import { Group } from '@/models/management/management';

export const getOrderedGroups = (groups: Group[]) => {
  // 그룹을 id로 매핑하여 빠르게 찾을 수 있도록 맵 생성
  const groupMap = new Map<number, Group>();
  for (const group of groups) {
    groupMap.set(parseInt(group.id as string), { ...group, childGroups: [] }); // 복사본 생성
  }

  // 최상위 그룹을 담을 배열
  const topLevelGroups: Group[] = [];

  for (const group of groups) {
    if (group.parentGroupId === null || group.parentGroupId === group.id) {
      // 부모가 없는 그룹은 최상위 그룹에 추가
      topLevelGroups.push(groupMap.get(parseInt(group.id as string))!);
    } else {
      // 부모가 있는 그룹은 부모의 childGroups 에 추가
      const parentGroup = groupMap.get(parseInt(group.parentGroupId));
      if (parentGroup?.childGroups) {
        parentGroup.childGroups.push(
          groupMap.get(parseInt(group.id as string))!
        );
      }
    }
  }

  return topLevelGroups;
};
