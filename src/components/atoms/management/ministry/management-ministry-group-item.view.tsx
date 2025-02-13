import React, { ChangeEvent, MutableRefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { MinistryGroup } from '@/models/management/management';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import MainInput from '@/components/atoms/common/input/main-input';
import { getIsWellFormedTitle } from '@/utils/check';
import { SIZE } from '@/constants/styles/style';

import Check from '../../../../../public/svg/check.svg';
import Plus from '../../../../../public/svg/plus.svg';

const MinistryGroupItemContainer = styled.div<{
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

const MinistryGroupItem = styled.div<{ $level: number }>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  padding: 5px 0;
  transition: background-color 0.3s;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;
  width: ${({ $level }) => `${100 - $level * 10}%`};
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

type ManagementMinistryGroupItemViewProps = {
  isHaveChildren: boolean | undefined;
  isOpen: boolean;
  isEdit: boolean;
  nameInputRef: MutableRefObject<HTMLInputElement | null>;
  ministryGroup: MinistryGroup;
  level: number;
  selectedMinistryGroupId: string | null;
  editName: string;
  onDropMinistryGroup: (
    ministryGroupId: string,
    parentMinistryGroupId: string | null
  ) => void;
  onClickToggle: (id: string) => void;
  onClickMinistryGroup: (ministryGroupId: string) => void;
  onClickMinistryGroupEdit: () => void;
  onClickMinistryGroupDelete: () => void;
  onClickMinistryGroupAdd: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveName: () => void;
};

const ManagementMinistryMinistryGroupItemView = ({
  isHaveChildren,
  isOpen,
  isEdit,
  ministryGroup,
  level,
  nameInputRef,
  selectedMinistryGroupId,
  editName,
  onDropMinistryGroup,
  onClickToggle,
  onClickMinistryGroup,
  onClickMinistryGroupEdit,
  onClickMinistryGroupDelete,
  onClickMinistryGroupAdd,
  onChangeName,
  onClickSaveName,
}: ManagementMinistryGroupItemViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const ITEM_TYPE = 'GROUP_ITEM';

  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE, // 동일한 타입끼리 드래그 & 드롭이 가능
    drop: (item: { id: string }) => {
      // 드래그된 그룹 ID와 드롭된 위치 그룹 ID를 전달
      onDropMinistryGroup(item.id, ministryGroup.id as string);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: ministryGroup.id as string },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // 드래그 상태를 추적
    }),
  });

  dragRef(dropRef(ref));

  return (
    <MinistryGroupItemContainer ref={ref} $isDragging={isDragging}>
      <MinistryGroupItem
        onClick={() => onClickMinistryGroup(ministryGroup.id as string)}
        $level={level}
      >
        <LeftContainer>
          <ToggleButton
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 전파 중지
              onClickToggle(ministryGroup.id as string);
            }}
          >
            <MainText color={GRAY.DARK} size={SIZE.EXTRA_SMALL}>
              {isHaveChildren ? (isOpen ? '▼' : '▶') : ''}
            </MainText>
          </ToggleButton>
          <MainInput
            ref={nameInputRef}
            value={isEdit ? editName : ministryGroup.name}
            onChange={onChangeName}
            height={10}
            color={
              (ministryGroup.id as string) === selectedMinistryGroupId
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
          ) : ministryGroup.id === null ? (
            <PlusButton onClick={onClickMinistryGroupAdd} />
          ) : (
            <SlideButtonList
              onClickEdit={onClickMinistryGroupEdit}
              onClickDelete={onClickMinistryGroupDelete}
              onClickAdd={onClickMinistryGroupAdd}
            />
          )}
        </RightContainer>
      </MinistryGroupItem>
      <HighlightLine $isOver={isOver} />
    </MinistryGroupItemContainer>
  );
};

export default ManagementMinistryMinistryGroupItemView;
