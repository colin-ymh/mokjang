import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { MinistryGroup } from '@mokjang/models';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useI18n } from '../../../../locales/client';
import MinistryGroupHierarchyList from '../../molecules/ministry/ministry-hierarchy-list';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

type MinistryGroupFilterViewProps = {
  isAllSelectable: boolean;
  isNullable: boolean;
  isDefaultOpen: boolean;
  topLevelMinistryGroupId?: string | null;
  selectedMinistryGroupId: string | null;
  onClickMinistryGroup: (ministryGroupId: string | null) => void;
};

// 헬퍼 함수들을 컴포넌트 외부에서 정의
const findMinistryGroupById = (
  ministryGroups: MinistryGroup[],
  targetId: string
): MinistryGroup | null => {
  for (const ministryGroup of ministryGroups) {
    if (ministryGroup.id === targetId) {
      return ministryGroup;
    }
    if (
      ministryGroup.childMinistryGroups &&
      ministryGroup.childMinistryGroups.length > 0
    ) {
      const found = findMinistryGroupById(
        ministryGroup.childMinistryGroups,
        targetId
      );
      if (found) return found;
    }
  }
  return null;
};

const getAllMinistryGroupIds = (
  ministryGroups: MinistryGroup[],
  topLevelMinistryGroupId?: string | null
): number[] => {
  let ids: number[] = [];

  if (topLevelMinistryGroupId) {
    const topMinistryGroup = findMinistryGroupById(
      ministryGroups,
      topLevelMinistryGroupId
    );
    if (topMinistryGroup) {
      ids.push(parseInt(topMinistryGroup.id as string));
      if (topMinistryGroup.childMinistryGroups?.length) {
        ids = ids.concat(
          getAllMinistryGroupIds(topMinistryGroup.childMinistryGroups)
        );
      }
    }
  } else {
    ids = [NaN];
    ministryGroups.forEach((ministryGroup) => {
      if (ministryGroup.id !== null)
        ids.push(parseInt(ministryGroup.id as string));
      if (ministryGroup.childMinistryGroups?.length) {
        ids = ids.concat(
          getAllMinistryGroupIds(ministryGroup.childMinistryGroups)
        );
      }
    });
  }

  return ids;
};

const getInitialOpenMinistryGroups = (
  ministryGroups: MinistryGroup[],
  isDefaultOpen: boolean,
  topLevelMinistryGroupId?: string | null
): Record<number, boolean> => {
  if (isDefaultOpen) {
    const allMinistryGroupIds = getAllMinistryGroupIds(
      ministryGroups,
      topLevelMinistryGroupId
    );
    return Object.fromEntries(allMinistryGroupIds.map((id) => [id, true]));
  } else {
    if (topLevelMinistryGroupId) {
      const topMinistryGroup = findMinistryGroupById(
        ministryGroups,
        topLevelMinistryGroupId
      );
      if (topMinistryGroup) {
        return { [parseInt(topMinistryGroup.id as string)]: true };
      }
    }
    return { [NaN]: true };
  }
};

const SelectMinistryHierarchyView = memo(
  ({
    isAllSelectable,
    isNullable,
    isDefaultOpen,
    topLevelMinistryGroupId,
    selectedMinistryGroupId,
    onClickMinistryGroup,
  }: MinistryGroupFilterViewProps) => {
    const t = useI18n();
    const { ministryGroups } = useSelector((state: RootState) => state.church);

    // 초기 상태를 useState의 lazy initialization으로 설정
    const [openMinistryGroups, setOpenMinistryGroups] = useState<
      Record<number, boolean>
    >(() =>
      getInitialOpenMinistryGroups(
        ministryGroups,
        isDefaultOpen,
        topLevelMinistryGroupId
      )
    );

    // props나 ministryGroups가 변경될 때만 상태 업데이트
    useEffect(() => {
      const newOpenMinistryGroups = getInitialOpenMinistryGroups(
        ministryGroups,
        isDefaultOpen,
        topLevelMinistryGroupId
      );
      setOpenMinistryGroups(newOpenMinistryGroups);
    }, [ministryGroups, isDefaultOpen, topLevelMinistryGroupId]);

    const onClickToggle = useCallback((id: number) => {
      setOpenMinistryGroups((prevState) => ({
        ...prevState,
        [id]: !(prevState[id] ?? false),
      }));
    }, []);

    const ministryGroupsToRender = useMemo(() => {
      if (!topLevelMinistryGroupId) {
        return ministryGroups;
      }

      const topLevelMinistryGroup = findMinistryGroupById(
        ministryGroups,
        topLevelMinistryGroupId
      );
      return topLevelMinistryGroup ? [topLevelMinistryGroup] : ministryGroups;
    }, [ministryGroups, topLevelMinistryGroupId]);

    return (
      <FilterContainer>
        <MinistryGroupHierarchyList
          isAllSelectable={isAllSelectable}
          isNullable={isNullable}
          ministryGroups={ministryGroupsToRender}
          level={0}
          openMinistryGroups={openMinistryGroups}
          selectedMinistryGroupId={selectedMinistryGroupId}
          onClickToggle={onClickToggle}
          onClickMinistryGroup={onClickMinistryGroup}
          t={t}
        />
      </FilterContainer>
    );
  }
);

export default SelectMinistryHierarchyView;
