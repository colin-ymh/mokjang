import React, { ChangeEvent, MutableRefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { Group } from '@/models/management/management';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import MainInput from '@/components/atoms/common/input/main-input';
import { getIsWellFormedTitle } from '@/utils/check';

import Check from '../../../../../public/svg/check.svg';
import Plus from '../../../../../public/svg/plus.svg';
import { SIZE } from '@/constants/styles/style';

const GroupItemContainer = styled.div<{
  $isDragging: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  border-bottom: 1px solid ${GRAY.LIGHT};
  padding: 1px;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};
`;

const GroupItem = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  padding: 5px 0;
  transition: background-color 0.3s;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;
  width: ${({ $level }) => `${100 - $level * 5}%`};
  height: 30px;
`;

const LeftContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const HighlightLine = styled.div<{ $isOver: boolean }>`
  height: ${({ $isOver }) => ($isOver ? '2px' : 0)};
  width: 100%;
  background-color: ${({ $isOver }) => ($isOver ? MAIN.DEFAULT : WHITE)};
  border-radius: 5px;
`;

const ToggleButton = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  bottom: 2px;
`;

const RightContainer = styled.div`
  display: flex;
  width: auto;
  justify-content: center;
  align-items: center;
`;

const CheckButton = styled(Check)<{ $isEnabled: boolean }>`
  display: flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 2px;
  stroke: ${WHITE};
  stroke-width: 2px;
  border-radius: 5px;
  background-color: ${({ $isEnabled }) =>
    $isEnabled ? MAIN.DEFAULT : GRAY.LIGHT};
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'default')};
`;

const PlusButton = styled(Plus)`
  display: flex;
  width: 18px;
  height: 18px;
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  border-radius: 5px;
  cursor: pointer;
  padding: 1px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type ManagementGroupItemViewProps = {
  isHaveChildren: boolean | undefined;
  isOpen: boolean;
  isEdit: boolean;
  nameInputRef: MutableRefObject<HTMLInputElement | null>;
  group: Group;
  level: number;
  selectedGroupId: string | null;
  editName: string;
  onDropGroup: (groupId: string, parentGroupId: string | null) => void;
  onClickToggle: (id: string) => void;
  onClickGroup: (groupId: string) => void;
  onClickGroupEdit: () => void;
  onClickGroupDelete: (groupId: string) => void;
  onClickGroupAdd: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveName: () => void;
};

const ManagementGroupItemView = ({
  isHaveChildren,
  isOpen,
  isEdit,
  group,
  level,
  nameInputRef,
  selectedGroupId,
  editName,
  onDropGroup,
  onClickToggle,
  onClickGroup,
  onClickGroupEdit,
  onClickGroupDelete,
  onClickGroupAdd,
  onChangeName,
  onClickSaveName,
}: ManagementGroupItemViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const ITEM_TYPE = 'GROUP_ITEM';

  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE, // 동일한 타입끼리 드래그 & 드롭이 가능
    drop: (item: { id: string }) => {
      // 드래그된 그룹 ID와 드롭된 위치 그룹 ID를 전달
      onDropGroup(item.id, group.id as string);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: group.id as string },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // 드래그 상태를 추적
    }),
  });

  dragRef(dropRef(ref));

  return (
    <GroupItemContainer ref={ref} $isDragging={isDragging}>
      <GroupItem
        onClick={() => onClickGroup(group.id as string)}
        $level={level}
      >
        <LeftContainer>
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 전파 중지
              onClickToggle(group.id as string);
            }}
          >
            <MainText color={GRAY.DARK} size={SIZE.EXTRA_SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
            </MainText>
          </ToggleButton>
          <MainInput
            ref={nameInputRef}
            value={isEdit ? editName : group.name}
            onChange={onChangeName}
            height={10}
            color={
              (group.id as string) === selectedGroupId
                ? MAIN.DEFAULT
                : GRAY.DARK
            }
            backgroundColor={WHITE}
            readOnly={!isEdit}
            borderBottomColor={WHITE}
          />
        </LeftContainer>
        <RightContainer>
          {isEdit ? (
            <CheckButton
              $isEnabled={getIsWellFormedTitle(editName)}
              onMouseDown={onClickSaveName}
            />
          ) : group.id === null ? (
            <PlusButton onClick={onClickGroupAdd} />
          ) : (
            <SlideButtonList
              onClickEdit={onClickGroupEdit}
              onClickDelete={() => onClickGroupDelete(group.id as string)}
              onClickAdd={onClickGroupAdd}
            />
          )}
        </RightContainer>
      </GroupItem>
      <HighlightLine $isOver={isOver} />
    </GroupItemContainer>
  );
};

export default ManagementGroupItemView;
