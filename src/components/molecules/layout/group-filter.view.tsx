import React, { useState } from "react";
import styled from "styled-components";
import { Group } from "@/models/setting/group";
import { GRAY, MAIN } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const GroupItemContainer = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  padding: 5px 5px 5px ${({ $level }) => $level * 20 + 10}px;
  transition: background-color 0.3s;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const ToggleButton = styled.div`
  display: flex;
  cursor: pointer;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

const ChildGroupsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type GroupFilterViewProps = {
  groups: Group[];
  selectedGroupId: string;
  onClickGroup: (id: string) => void;
};

// 재귀적으로 그룹을 렌더링하는 함수
const renderGroups = (
  groups: Group[],
  level: number,
  openGroups: Record<number, boolean>,
  selectedGroupId: string,
  onClickToggle: (id: number) => void,
  onClickGroup: (id: string) => void,
) => {
  return groups.map((group) => {
    const isHaveChildren = group.childGroups && group.childGroups.length > 0;
    const isOpen = openGroups[parseInt(group.id)] ?? false; // 기본적으로 닫힘 상태
    return (
      <ChildGroupsContainer key={parseInt(group.id)}>
        <GroupItemContainer
          $level={level}
          onClick={() => onClickGroup(group.id)}
        >
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 전파 중지
              onClickToggle(parseInt(group.id));
            }}
          >
            <MainText color={GRAY.DARK}>
              {isHaveChildren ? (isOpen ? "▼" : "▶") : ""}
            </MainText>
          </ToggleButton>
          <MainText
            color={group.id === selectedGroupId ? MAIN.DEFAULT : GRAY.DARK}
          >
            {group.name}
          </MainText>
        </GroupItemContainer>
        {isOpen &&
          group.childGroups &&
          group.childGroups.length > 0 &&
          renderGroups(
            group.childGroups,
            level + 1,
            openGroups,
            selectedGroupId,
            onClickToggle,
            onClickGroup,
          )}
      </ChildGroupsContainer>
    );
  });
};

const GroupFilterView = ({
  groups,
  selectedGroupId,
  onClickGroup,
}: GroupFilterViewProps) => {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

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
        selectedGroupId,
        onClickToggle,
        onClickGroup,
      )}
    </FilterContainer>
  );
};

export default GroupFilterView;
