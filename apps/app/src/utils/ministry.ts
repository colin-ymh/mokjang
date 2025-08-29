import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '../models/management/management';
import { MinistryGroupsApi } from '../api/management/ministry/ministry-groups.api';

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
 * 계층 구조에 따라 그룹을 정렬하는 함수
 */
export const getOrderedMinistryGroups = async (churchId: string) => {
  const ministryGroupsApi = new MinistryGroupsApi(false);

  // 최상위 그룹 배열
  let ministryGroups: MinistryGroup[] = [];
  // 탐색할 부모 그룹 ID 스택 (최초에는 최상위 그룹)
  let parentMinistryGroupIds: (string | undefined)[] = [undefined];

  // BFS/DFS 형태로 모든 그룹을 불러와서 트리 구조로 삽입
  while (parentMinistryGroupIds.length > 0) {
    const parentMinistryGroupId = parentMinistryGroupIds.pop();

    const response = await ministryGroupsApi.getMinistryGroups({
      churchId,
      parentMinistryGroupId,
    });
    const newMinistryGroups: MinistryGroup[] = response.data.data;

    // order 기준으로 우선 정렬
    newMinistryGroups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const newMinistryGroup of newMinistryGroups) {
      // 부모 그룹이 있으면 해당 부모의 childMinistryGroups 배열에 삽입
      if (newMinistryGroup.parentMinistryGroupId) {
        const parent = getMinistryGroupById(
          ministryGroups,
          newMinistryGroup.parentMinistryGroupId
        );
        if (parent) {
          parent.childMinistryGroups = parent.childMinistryGroups || [];
          parent.childMinistryGroups.push(newMinistryGroup);
        }
      }
      // 부모 그룹이 없으면 최상위 그룹
      else {
        ministryGroups.push(newMinistryGroup);
      }

      // 하위 그룹이 있으면 다시 스택에 추가
      if (newMinistryGroup.childMinistryGroupIds.length > 0) {
        parentMinistryGroupIds.push(newMinistryGroup.id as string);
      }
    }
  }

  // 재귀적으로 childMinistryGroups를 order 기준으로 정렬
  const sortRecursively = (list: MinistryGroup[]) => {
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const item of list) {
      if (item.childMinistryGroups && item.childMinistryGroups.length > 0) {
        sortRecursively(item.childMinistryGroups);
      }
    }
  };

  // 최상위 그룹도 정렬
  sortRecursively(ministryGroups);

  return ministryGroups;
};
/**
 * 그룹 ID 로 해당 그룹을 찾기
 * @param ministryGroupId
 * @param ministryGroups
 */
export const getMinistryGroup = (
  ministryGroupId: string | null,
  ministryGroups: MinistryGroup[]
) => {
  if (ministryGroupId === null) {
    return DEFAULT_MINISTRY_GROUP;
  }

  const q = [...ministryGroups];

  while (q.length > 0) {
    const cur: MinistryGroup = q.shift()!;

    if (cur.id === ministryGroupId) {
      return cur;
    }

    // 하위 그룹들을 큐에 추가
    if (cur.childMinistryGroups && cur.childMinistryGroups.length > 0) {
      q.push(...cur.childMinistryGroups);
    }
  }

  return DEFAULT_MINISTRY_GROUP;
};
