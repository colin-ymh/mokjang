import React, { ChangeEvent, MutableRefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import MainInput from '@/components/atoms/common/input/main-input';
import { getIsWellFormedName } from '@/utils/check';

import Check from '../../../../../public/svg/check.svg';
import Plus from '../../../../../public/svg/plus.svg';
import { Ministry } from '@/models/management/management';

const MinistryItemContainer = styled.div<{
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

const MinistryItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  padding: 5px 0;
  transition: background-color 0.3s;
  border-radius: 5px;
  gap: 10px;
  cursor: pointer;
  width: 100%;
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

type ManagementMinistryItemViewProps = {
  isEdit: boolean;
  nameInputRef: MutableRefObject<HTMLInputElement | null>;
  ministry: Ministry;
  selectedMinistryId: string | null;
  editName: string;
  onDropMinistry: (ministryId: string, parentMinistryId: string | null) => void;
  onClickMinistry: (ministry: Ministry) => void;
  onClickMinistryEdit: () => void;
  onClickMinistryDelete: (ministryId: string) => void;
  onClickMinistryAdd: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveName: () => void;
};

const ManagementMinistryItemView = ({
  isEdit,
  nameInputRef,
  selectedMinistryId,
  ministry,
  editName,
  onDropMinistry,
  onClickMinistry,
  onClickMinistryEdit,
  onClickMinistryDelete,
  onClickMinistryAdd,
  onChangeName,
  onClickSaveName,
}: ManagementMinistryItemViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const ITEM_TYPE = 'GROUP_ITEM';

  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE, // 동일한 타입끼리 드래그 & 드롭이 가능
    drop: (item: { id: string }) => {
      // 드래그된 그룹 ID와 드롭된 위치 그룹 ID를 전달
      onDropMinistry(item.id, ministry.id as string);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: ministry.id as string },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // 드래그 상태를 추적
    }),
  });

  dragRef(dropRef(ref));

  return (
    <MinistryItemContainer ref={ref} $isDragging={isDragging}>
      <MinistryItem onClick={() => onClickMinistry(ministry)}>
        <LeftContainer>
          <MainInput
            ref={nameInputRef}
            value={isEdit ? editName : ministry.name}
            onChange={onChangeName}
            height={10}
            color={
              (ministry.id as string) === selectedMinistryId
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
              $isEnabled={getIsWellFormedName(editName)}
              onMouseDown={onClickSaveName}
            />
          ) : ministry.id === null ? (
            <PlusButton onClick={onClickMinistryAdd} />
          ) : (
            <SlideButtonList
              onClickEdit={onClickMinistryEdit}
              onClickDelete={() => onClickMinistryDelete(ministry.id as string)}
              isAddShown={false}
            />
          )}
        </RightContainer>
      </MinistryItem>
      <HighlightLine $isOver={isOver} />
    </MinistryItemContainer>
  );
};

export default ManagementMinistryItemView;
