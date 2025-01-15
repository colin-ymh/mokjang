import React, { ChangeEvent, MutableRefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';

import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import MainInput from '@/components/atoms/common/input/main-input';
import { getIsWellFormedName } from '@/utils/check';
import { GroupRole } from '@/models/management/management';

import Check from '../../../../../public/svg/check.svg';
import Plus from '../../../../../public/svg/plus.svg';

const RoleItemContainer = styled.div<{
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

const RoleItem = styled.div`
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

type ManagementRoleItemViewProps = {
  isEdit: boolean;
  nameInputRef: MutableRefObject<HTMLInputElement | null>;
  role: GroupRole;
  selectedRoleId: string | null;
  editName: string;
  onDropRole: (roleId: string, parentRoleId: string | null) => void;
  onClickRole: (role: GroupRole) => void;
  onClickRoleEdit: () => void;
  onClickRoleDelete: (roleId: string) => void;
  onClickRoleAdd: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveName: () => void;
};

const ManagementRoleItemView = ({
  isEdit,
  nameInputRef,
  selectedRoleId,
  role,
  editName,
  onDropRole,
  onClickRole,
  onClickRoleEdit,
  onClickRoleDelete,
  onClickRoleAdd,
  onChangeName,
  onClickSaveName,
}: ManagementRoleItemViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const ITEM_TYPE = 'GROUP_ITEM';

  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE, // 동일한 타입끼리 드래그 & 드롭이 가능
    drop: (item: { id: string }) => {
      // 드래그된 그룹 ID와 드롭된 위치 그룹 ID를 전달
      onDropRole(item.id, role.id as string);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { id: role.id as string },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // 드래그 상태를 추적
    }),
  });

  dragRef(dropRef(ref));

  return (
    <RoleItemContainer ref={ref} $isDragging={isDragging}>
      <RoleItem onClick={() => onClickRole(role)}>
        <LeftContainer>
          <MainInput
            ref={nameInputRef}
            value={isEdit ? editName : role.role}
            onChange={onChangeName}
            height={10}
            color={
              (role.id as string) === selectedRoleId ? MAIN.DEFAULT : GRAY.DARK
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
          ) : role.id === null ? (
            <PlusButton onClick={onClickRoleAdd} />
          ) : (
            <SlideButtonList
              onClickEdit={onClickRoleEdit}
              onClickDelete={() => onClickRoleDelete(role.id as string)}
              isAddShown={false}
            />
          )}
        </RightContainer>
      </RoleItem>
      <HighlightLine $isOver={isOver} />
    </RoleItemContainer>
  );
};

export default ManagementRoleItemView;
