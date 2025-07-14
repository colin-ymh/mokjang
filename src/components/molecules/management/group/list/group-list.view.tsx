import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import ManagementGroupItem from '@/components/atoms/management/group/list/management-group-item';
import useWindowSize from '@/hooks/window/window';

const FilterContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: ${({ height }) => `${height - 250}px`};
`;

type GroupListViewProps = {
  list: {
    groups: Group[];
  };
  toast: {
    setIsToastShown: Dispatch<SetStateAction<boolean>>;
    setToastText: Dispatch<SetStateAction<string>>;
    setToastColor: Dispatch<SetStateAction<string>>;
  };
  item: {
    closedGroups: Set<number>;
    selectedGroupId: string | null;
    onClickGroup: (id: string) => void;
    onClickToggle: (id: string) => void;
  };
};

const GroupListView = (props: GroupListViewProps) => {
  const { height } = useWindowSize();
  const { groups } = props.list;
  const toastProps = props.toast;
  const itemProps = props.item;
  return (
    <>
      <FilterContainer height={height}>
        {groups.map((group) => (
          <ManagementGroupItem
            key={group.id}
            level={0}
            group={group}
            {...itemProps}
            {...toastProps}
          />
        ))}
      </FilterContainer>
    </>
  );
};

export default GroupListView;
