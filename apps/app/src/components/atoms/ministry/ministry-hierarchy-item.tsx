// 개별 그룹 아이템 컴포넌트
import React, { memo, useCallback } from 'react';
import { MinistryGroup } from '@mokjang/models';
import { MainText } from '@mokjang/components';
import { GRAY, MAIN } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';
import styled from 'styled-components';
import { ALL, MEDIA_MIN_WIDTH } from '@mokjang/constants';

const MinistryGroupHierarchyItemContainer = styled.div<{ $level: number }>`
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

type MinistryGroupHierarchyItemProps = {
  isAllSelectable: boolean;
  ministryGroup: MinistryGroup;
  level: number;
  isOpen: boolean;
  isSelected: boolean;
  onClickToggle: (id: number) => void;
  onClickMinistryGroup: (ministryGroupId: string | null) => void;
  t: (key: string, ...args: any[]) => string;
};

const MinistryGroupHierarchyItem = memo(
  ({
    isAllSelectable,
    ministryGroup,
    level,
    isOpen,
    isSelected,
    onClickToggle,
    onClickMinistryGroup,
    t,
  }: MinistryGroupHierarchyItemProps) => {
    const isHaveChildren =
      ministryGroup.childMinistryGroups &&
      ministryGroup.childMinistryGroups.length > 0;
    const ministryGroupIdNum = parseInt(ministryGroup.id as string);

    const handleToggleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onClickToggle(ministryGroupIdNum);
      },
      [onClickToggle, ministryGroupIdNum]
    );

    const handleMinistryGroupClick = useCallback(() => {
      if (!isAllSelectable && ministryGroup.id === ALL) return;
      onClickMinistryGroup(ministryGroup.id);
    }, [onClickMinistryGroup, ministryGroup.id]);

    return (
      <MinistryGroupHierarchyItemContainer
        $level={level}
        onClick={handleMinistryGroupClick}
      >
        <LeftContainer>
          <DesktopToggleButton onClick={handleToggleClick}>
            <MainText color={GRAY.DEFAULT} size={SIZE.EXTRA_SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
            </MainText>
          </DesktopToggleButton>
          <MainText color={isSelected ? MAIN.DEFAULT : GRAY.DARK}>
            {ministryGroup.id === null
              ? t('none')
              : ministryGroup.id === ALL
                ? t(ALL)
                : ministryGroup.name}
          </MainText>
        </LeftContainer>
        <RightContainer>
          <MobileToggleButton onClick={handleToggleClick}>
            <MainText color={GRAY.DARK} size={SIZE.SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
            </MainText>
          </MobileToggleButton>
        </RightContainer>
      </MinistryGroupHierarchyItemContainer>
    );
  }
);

MinistryGroupHierarchyItem.displayName = 'MinistryGroupHierarchyItem';
export default memo(MinistryGroupHierarchyItem);
