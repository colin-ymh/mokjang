import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { GroupsApi } from '@/api/management/group/groups.api';
import { BLANK } from '@/constants/constant';

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

  // 최상위 그룹 배열
  let groups: Group[] = [];
  // 탐색할 부모 그룹 ID 스택 (최초에는 최상위 그룹)
  let parentGroupIds: (string | undefined)[] = [undefined];

  // BFS/DFS 형태로 모든 그룹을 불러와서 트리 구조로 삽입
  while (parentGroupIds.length > 0) {
    const parentGroupId = parentGroupIds.pop();

    const response = await groupsApi.getGroups({ churchId, parentGroupId });
    const newGroups: Group[] = response.data.data;

    // order 기준으로 우선 정렬
    newGroups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const newGroup of newGroups) {
      // 부모 그룹이 있으면 해당 부모의 childGroups 배열에 삽입
      if (newGroup.parentGroupId) {
        const parent = getGroupById(groups, newGroup.parentGroupId);
        if (parent) {
          parent.childGroups = parent.childGroups || [];
          parent.childGroups.push(newGroup);
        }
      }
      // 부모 그룹이 없으면 최상위 그룹
      else {
        groups.push(newGroup);
      }

      // 하위 그룹이 있으면 다시 스택에 추가
      if (newGroup.childGroupIds.length > 0) {
        parentGroupIds.push(newGroup.id as string);
      }
    }
  }

  // 재귀적으로 childGroups를 order 기준으로 정렬
  const sortRecursively = (list: Group[]) => {
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const item of list) {
      if (item.childGroups && item.childGroups.length > 0) {
        sortRecursively(item.childGroups);
      }
    }
  };

  // 최상위 그룹도 정렬
  sortRecursively(groups);

  return groups;
};
/**
 * 그룹 ID 로 해당 그룹을 찾기
 * @param groupId
 * @param groups
 */
export const getGroup = (groupId: string | null, groups: Group[]) => {
  if (groupId === null) {
    return {
      id: null,
      name: BLANK,
    } as Group;
  }

  const q = [...groups];

  while (q.length > 0) {
    const cur: Group = q.shift()!;

    if (cur.id === groupId) {
      return cur;
    }

    // 하위 그룹들을 큐에 추가
    if (cur.childGroups && cur.childGroups.length > 0) {
      q.push(...cur.childGroups);
    }
  }

  return DEFAULT_GROUP;
};

/**
 * 특정 그룹 ID에 해당하는 그룹을 기준으로,
 * 모든 자식 및 하위 자식 그룹 ID를 반환
 * @param groups 전체 그룹 계층 구조
 * @param group 기준 그룹 (childGroups는 없음)
 */
export const getEveryChildGroups = (
  groups: Group[],
  group: Group
): string[] => {
  const ids: string[] = [];

  // 전체 계층에서 해당 group.id를 가진 그룹을 찾아 반환
  const findGroupById = (list: Group[], id: string): Group | undefined => {
    for (const g of list) {
      if (g.id === id) return g;
      if (g.childGroups) {
        const found = findGroupById(g.childGroups, id);
        if (found) return found;
      }
    }
  };

  // 재귀적으로 자식 ID들을 수집
  const collectChildGroupIds = (group: Group) => {
    if (group.childGroups && group.childGroups.length > 0) {
      for (const child of group.childGroups) {
        if (child.id != null) {
          ids.push(child.id);
          collectChildGroupIds(child);
        }
      }
    }
  };

  const fullGroup = findGroupById(groups, group.id as string);
  if (fullGroup) {
    collectChildGroupIds(fullGroup);
  }

  return ids;
};
