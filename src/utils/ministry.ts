/**
 * 계층 구조에 따라 사역 그룹을 정렬하는 함수
 */
import { MinistryGroup } from '@/models/management/management';

export const getOrderedMinistryGroups = (ministryGroups: MinistryGroup[]) => {
  // 그룹을 id로 매핑하여 빠르게 찾을 수 있도록 맵 생성
  const ministryGroupMap = new Map<number, MinistryGroup>();
  for (const ministryGroup of ministryGroups) {
    ministryGroupMap.set(parseInt(ministryGroup.id as string), {
      ...ministryGroup,
      childMinistryGroups: [],
    }); // 복사본 생성
  }

  // 최상위 그룹을 담을 배열
  const topLevelMinistryGroups: MinistryGroup[] = [];

  for (const ministryGroup of ministryGroups) {
    if (
      ministryGroup.parentMinistryGroupId === null ||
      ministryGroup.parentMinistryGroupId === ministryGroup.id
    ) {
      // 부모가 없는 그룹은 최상위 그룹에 추가
      topLevelMinistryGroups.push(
        ministryGroupMap.get(parseInt(ministryGroup.id as string))!
      );
    } else {
      // 부모가 있는 그룹은 부모의 childMinistryGroups 에 추가
      const parentMinistryGroup = ministryGroupMap.get(
        parseInt(ministryGroup.parentMinistryGroupId)
      );
      if (parentMinistryGroup?.childMinistryGroups) {
        parentMinistryGroup.childMinistryGroups.push(
          ministryGroupMap.get(parseInt(ministryGroup.id as string))!
        );
      }
    }
  }

  return topLevelMinistryGroups;
};
