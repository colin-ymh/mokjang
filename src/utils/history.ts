import { GroupHistory } from '@/models/member/history';

/**
 * 교인의 소그룹 이력을 통해 현재 그룹을 반환
 * @param groups
 */
export const getCurrentGroup = (groups: GroupHistory[]) => {
  return groups.find((group) => group.endDate === null);
};
