import { MinistryGroup } from '@/models/management/management';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';

const getMinistryGroupById = (
  list: MinistryGroup[],
  id: string
): MinistryGroup | undefined => {
  for (const g of list) {
    if (g.id === id) return g;
    if (g.childMinistryGroups) {
      const found = getMinistryGroupById(g.childMinistryGroups, id);
      if (found) return found;
    }
  }
};

/**
 * 계층 구조에 따라 사역 그룹을 정렬하는 함수
 */
export const getOrderedMinistryGroups = async (churchId: string) => {
  const ministryGroupsApi = new MinistryGroupsApi(false);

  let ministryGroups: MinistryGroup[] = [];
  let parentMinistryGroupIds: (string | undefined)[] = [undefined];

  while (parentMinistryGroupIds.length > 0) {
    const parentMinistryGroupId = parentMinistryGroupIds.pop();

    const response = await ministryGroupsApi.getMinistryGroups({
      churchId,
      parentMinistryGroupId,
    });

    const newMinistryGroups: MinistryGroup[] = response.data.data;

    for (const newMinistryGroup of newMinistryGroups) {
      // 부모 그룹이 있으면, 해당 부모의 childGroups 배열에 삽입
      if (newMinistryGroup.parentMinistryGroupId) {
        const parent = getMinistryGroupById(
          ministryGroups,
          newMinistryGroup.parentMinistryGroupId
        );
        if (parent) {
          if (!parent.childMinistryGroups) {
            parent.childMinistryGroups = [];
          }
          parent.childMinistryGroups.push(newMinistryGroup);
        }
      }
      // 부모 그룹이 없으면, 최상위 그룹
      else {
        ministryGroups.push(newMinistryGroup);
      }

      if (newMinistryGroup.childMinistryGroupIds.length > 0) {
        parentMinistryGroupIds.push(newMinistryGroup.id as string);
      }
    }
  }

  return ministryGroups;
};
