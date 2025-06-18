import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../locales/client';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const GroupItemContainer = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px 5px ${({ $level }) => $level * 20 + 10}px;
  transition: background-color 0.3s;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
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
  isDefaultOpen: boolean;
  selectedGroupId: string | null;
  onClickGroup: (groupId: string | null) => void;
};

// 재귀적으로 그룹을 렌더링하는 함수
const renderGroups = (
  t: (key: string, ...args: any[]) => string,
  groups: Group[],
  level: number,
  openGroups: Record<number, boolean>,
  selectedGroupId: string | null,
  onClickToggle: (id: number) => void,
  onClickGroup: (groupId: string | null) => void
) => {
  return groups.map((group) => {
    const isHaveChildren = group.childGroups && group.childGroups.length > 0;
    const isOpen = openGroups[parseInt(group.id as string)] ?? false; // 기본적으로 닫힘 상태

    return (
      <ChildGroupsContainer key={parseInt(group.id as string)}>
        <GroupItemContainer
          $level={level}
          onClick={() => onClickGroup(group.id)}
        >
          <LeftContainer>
            <DesktopToggleButton
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 중지
                onClickToggle(parseInt(group.id as string));
              }}
            >
              <MainText color={GRAY.DEFAULT} size={SIZE.EXTRA_SMALL}>
                {isHaveChildren ? (isOpen ? '▼' : '▶') : '⦁'}
              </MainText>
            </DesktopToggleButton>
            <MainText
              color={
                (group.id as string) === selectedGroupId
                  ? MAIN.DEFAULT
                  : GRAY.DARK
              }
            >
              {group.name || t('all')}
            </MainText>
          </LeftContainer>
          <RightContainer>
            {/*<MainText color={GRAY.DEFAULT} size={SIZE.EXTRA_SMALL}>*/}
            {/*  {group.id && group.membersCount}*/}
            {/*</MainText>*/}
            <MobileToggleButton
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 중지
                onClickToggle(parseInt(group.id as string));
              }}
            >
              <MainText color={GRAY.DARK} size={SIZE.SMALL}>
                {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
              </MainText>
            </MobileToggleButton>
          </RightContainer>
        </GroupItemContainer>
        {isOpen &&
          group.childGroups &&
          group.childGroups.length > 0 &&
          renderGroups(
            t,
            group.childGroups,
            level + 1,
            openGroups,
            selectedGroupId,
            onClickToggle,
            onClickGroup
          )}
      </ChildGroupsContainer>
    );
  });
};

const SelectGroupHierarchyView = ({
  isDefaultOpen,
  selectedGroupId,
  onClickGroup,
}: GroupFilterViewProps) => {
  const t = useI18n();
  const { groups } = useSelector((state: RootState) => state.church);

  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  const getAllGroupIds = (groups: Group[]): number[] => {
    let ids: number[] = [NaN];
    groups.forEach((group) => {
      if (group.id !== null) ids.push(parseInt(group.id as string));
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
        t,
        groups,
        0,
        openGroups,
        selectedGroupId,
        onClickToggle,
        onClickGroup
      )}
    </FilterContainer>
  );
};

export default SelectGroupHierarchyView;
