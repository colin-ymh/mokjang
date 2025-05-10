import { Group } from '@/models/management/management';
import { GroupsApi } from '@/api/management/group/groups.api';

const getGroupById = (list: Group[], id: string): Group | undefined => {
  for (const g of list) {
    if (g.id === id) return g;
    if (g.childGroups) {
      const found = getGroupById(g.childGroups, id);
      if (found) return found;
    }
  }
};

/**
 * 계층 구조에 따라 그룹을 정렬하는 함수
 */
export const getOrderedGroups = async (churchId: string) => {
  const groupsApi = new GroupsApi(false);

  let groups: Group[] = [];
  let parentGroupIds: (string | undefined)[] = [undefined];

  while (parentGroupIds.length > 0) {
    const parentGroupId = parentGroupIds.pop();

    const response = await groupsApi.getGroups({ churchId, parentGroupId });

    const newGroups: Group[] = response.data.data;

    for (const newGroup of newGroups) {
      // 부모 그룹이 있으면, 해당 부모의 childGroups 배열에 삽입
      if (newGroup.parentGroupId) {
        const parent = getGroupById(groups, newGroup.parentGroupId);
        if (parent) {
          if (!parent.childGroups) {
            parent.childGroups = [];
          }
          parent.childGroups.push(newGroup);
        }
      }
      // 부모 그룹이 없으면, 최상위 그룹
      else {
        groups.push(newGroup);
      }

      if (newGroup.childGroupIds.length > 0) {
        parentGroupIds.push(newGroup.id as string);
      }
    }
  }

  return groups;
};
