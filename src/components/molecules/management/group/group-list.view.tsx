import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import ManagementGroupItem from '@/components/atoms/management/group/management-group-item';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import useWindowSize from '@/hooks/window/window';

const FilterContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: ${({ height }) => `${height - 250}px`};
`;

type GroupListViewProps = {
  isToastShown: boolean;
  toastText: string;
  toastColor: string;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
  setToastText: Dispatch<SetStateAction<string>>;
  setToastColor: Dispatch<SetStateAction<string>>;
  groups: Group[];
  closedGroups: Set<number>;
  selectedGroupId: string | null;
  setSelectedGroup: Dispatch<SetStateAction<Group>>;
  onClickToggle: (id: string) => void;
};

const GroupListView = ({
  groups,
  closedGroups,
  selectedGroupId,
  setSelectedGroup,
  onClickToggle,
  isToastShown,
  toastText,
  toastColor,
  setIsToastShown,
  setToastText,
  setToastColor,
}: GroupListViewProps) => {
  const { height } = useWindowSize();
  return (
    <>
      <FilterContainer height={height}>
        {groups.map((group) => (
          <ManagementGroupItem
            key={group.id}
            group={group}
            level={0}
            selectedGroupId={selectedGroupId}
            setSelectedGroup={setSelectedGroup}
            closedGroups={closedGroups}
            onClickToggle={onClickToggle}
            setIsToastShown={setIsToastShown}
            setToastText={setToastText}
            setToastColor={setToastColor}
          />
        ))}
      </FilterContainer>

      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={toastText}
          backgroundColor={toastColor}
        />
      )}
    </>
  );
};

export default GroupListView;
