// 개별 그룹 아이템 컴포넌트
import React, { memo, useCallback } from 'react';
import { Group } from '../../../models/management/management';
import { MainText } from '../common/text/main-text';
import { GRAY, MAIN } from '../../../constants/styles/color';
import { SIZE } from '../../../constants/styles/style';
import styled from 'styled-components';
import { ALL, MEDIA_MIN_WIDTH } from '../../../constants/constant';

const GroupHierarchyItemContainer = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px 5px ${({ $level }) => $level * 20 + 10}px;
  transition: background-color 0.3s;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
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

type GroupHierarchyItemProps = {
  isAllSelectable: boolean;
  group: Group;
  level: number;
  isOpen: boolean;
  isSelected: boolean;
  onClickToggle: (id: number) => void;
  onClickGroup: (groupId: string | null) => void;
  t: (key: string, ...args: any[]) => string;
};

const GroupHierarchyItem = memo(
  ({
    isAllSelectable,
    group,
    level,
    isOpen,
    isSelected,
    onClickToggle,
    onClickGroup,
    t,
  }: GroupHierarchyItemProps) => {
    const isHaveChildren = group.childGroups && group.childGroups.length > 0;
    const groupIdNum = parseInt(group.id as string);

    const handleToggleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClickToggle(groupIdNum);
      },
      [onClickToggle, groupIdNum]
    );

    const handleGroupClick = useCallback(() => {
      if (!isAllSelectable && group.id === ALL) return;
      onClickGroup(group.id);
    }, [onClickGroup, group.id]);

    return (
      <GroupHierarchyItemContainer $level={level} onClick={handleGroupClick}>
        <LeftContainer>
          <DesktopToggleButton onClick={handleToggleClick}>
            <MainText color={GRAY.DEFAULT} size={SIZE.EXTRA_SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
            </MainText>
          </DesktopToggleButton>
          <MainText color={isSelected ? MAIN.DEFAULT : GRAY.DARK}>
            {group.id === null
              ? t('none')
              : group.id === ALL
                ? t(ALL)
                : group.name}
          </MainText>
        </LeftContainer>
        <RightContainer>
          <MobileToggleButton onClick={handleToggleClick}>
            <MainText color={GRAY.DARK} size={SIZE.SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
            </MainText>
          </MobileToggleButton>
        </RightContainer>
      </GroupHierarchyItemContainer>
    );
  }
);

GroupHierarchyItem.displayName = 'GroupHierarchyItem';
export default memo(GroupHierarchyItem);
