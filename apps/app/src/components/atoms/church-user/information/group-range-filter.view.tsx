import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Group } from '../../../../models/management/management';
import { GRAY, MAIN } from '../../../../constants/styles/color';
import { MainText } from '../../common/text/main-text';
import { SIZE } from '../../../../constants/styles/style';
import { MEDIA_MIN_WIDTH } from '../../../../constants/constant';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const GroupItemContainer = styled.div<{ $level: number; $isDisabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px 5px ${({ $level }) => $level * 20 + 10}px;
  transition: background-color 0.3s;
  border-radius: 5px;
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: ${({ $isDisabled }) => !$isDisabled && GRAY.LIGHT};
  }
`;

const LeftContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const DesktopToggleButton = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    cursor: pointer;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
  }
`;

const MobileToggleButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const ChildGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type GroupFilterViewProps = {
  groups: Group[];
  isDefaultOpen: boolean;
  selectedGroupIds: (string | null)[];
  onClickGroup: (group: Group) => void;
};

// 상위 그룹이 선택되었는지 확인하는 함수
const isParentSelected = (
  group: Group,
  selectedGroupIds: (string | null)[],
  groupMap: Record<string, Group>
): boolean => {
  // 1. "전체" 옵션이 선택된 경우 모든 그룹 비활성화
  if (selectedGroupIds.includes(null)) {
    return true;
  }

  // 2. 상위 그룹 중 하나라도 선택된 경우 비활성화
  let currentParentId = group.parentGroupId;
  while (currentParentId) {
    if (selectedGroupIds.includes(currentParentId)) return true;
    const parentGroup = groupMap[currentParentId];
    if (!parentGroup) break;
    currentParentId = parentGroup.parentGroupId;
  }

  return false;
};

// 재귀적으로 그룹을 렌더링하는 함수
const renderGroups = (
  groups: Group[],
  level: number,
  openGroups: Record<number, boolean>,
  selectedGroupIds: (string | null)[],
  onClickToggle: (id: number) => void,
  onClickGroup: (group: Group) => void,
  groupMap: Record<string, Group>
) => {
  return groups.map((group) => {
    const isHaveChildren = group.childGroups && group.childGroups.length > 0;
    const isOpen = openGroups[parseInt(group.id as string)] ?? false;
    const isDisabled =
      group.id !== null
        ? isParentSelected(group, selectedGroupIds, groupMap)
        : false;

    return (
      <ChildGroupsContainer key={parseInt(group.id as string)}>
        <GroupItemContainer
          $level={level}
          onClick={() => {
            if (!isDisabled) onClickGroup(group);
          }}
          $isDisabled={isDisabled}
        >
          <LeftContainer>
            <DesktopToggleButton
              onClick={(e) => {
                e.stopPropagation();
                onClickToggle(parseInt(group.id as string));
              }}
            >
              <MainText
                color={isDisabled ? GRAY.LIGHT : GRAY.DARK}
                size={SIZE.EXTRA_SMALL}
              >
                {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
              </MainText>
            </DesktopToggleButton>
            <MainText
              color={
                isDisabled
                  ? MAIN.LIGHT
                  : selectedGroupIds.includes(group.id as string)
                    ? MAIN.DEFAULT
                    : GRAY.DARK
              }
            >
              {group.name}
            </MainText>
          </LeftContainer>
          <RightContainer>
            <MobileToggleButton
              onClick={(e) => {
                e.stopPropagation();
                onClickToggle(parseInt(group.id as string));
              }}
            >
              <MainText
                color={isDisabled ? GRAY.LIGHT : GRAY.DARK}
                size={SIZE.EXTRA_SMALL}
              >
                {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
              </MainText>
            </MobileToggleButton>
          </RightContainer>
        </GroupItemContainer>
        {isOpen &&
          group.childGroups &&
          group.childGroups.length > 0 &&
          renderGroups(
            group.childGroups,
            level + 1,
            openGroups,
            selectedGroupIds,
            onClickToggle,
            onClickGroup,
            groupMap
          )}
      </ChildGroupsContainer>
    );
  });
};

const GroupRangeFilterView = ({
  groups,
  isDefaultOpen,
  selectedGroupIds,
  onClickGroup,
}: GroupFilterViewProps) => {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // 전체 그룹을 평탄화하여 id → 그룹 맵 생성
  const flattenGroups = (groups: Group[]): Group[] => {
    return groups.flatMap((group) => [
      group,
      ...(group.childGroups ? flattenGroups(group.childGroups) : []),
    ]);
  };

  const groupMap: Record<string, Group> = {};
  flattenGroups(groups).forEach((g) => {
    if (g.id) groupMap[g.id] = g;
  });

  const getAllGroupIds = (groups: Group[]): number[] => {
    let ids: number[] = [NaN];
    groups.forEach((group) => {
      if (group.id !== null) ids.push(parseInt(group.id));
      if (group.childGroups?.length) {
        ids = ids.concat(getAllGroupIds(group.childGroups));
      }
    });
    return ids;
  };

  useEffect(() => {
    if (isDefaultOpen) {
      const allGroupIds = getAllGroupIds(groups);
      const initialOpenGroups = Object.fromEntries(
        allGroupIds.map((id) => [id, true])
      );
      setOpenGroups(initialOpenGroups);
    }
  }, [groups, isDefaultOpen]);

  const onClickToggle = (id: number) => {
    setOpenGroups((prevState) => ({
      ...prevState,
      [id]: !(prevState[id] ?? false),
    }));
  };

  return (
    <FilterContainer>
      {renderGroups(
        groups,
        0,
        openGroups,
        selectedGroupIds,
        onClickToggle,
        onClickGroup,
        groupMap
      )}
    </FilterContainer>
  );
};

export default GroupRangeFilterView;
