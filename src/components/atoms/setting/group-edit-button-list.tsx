import styled from 'styled-components';
import React, { useState } from 'react';
import { DESTRUCTIVE, GRAY, WHITE } from '@/constants/styles/color';

import Kebab from '../../../../public/svg/kebab.svg';
import Trash from '../../../../public/svg/trash.svg';
import Pencil from '../../../../public/svg/pencil.svg';
import Plus from '../../../../public/svg/plus.svg';

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  border-radius: 5px;
  background-color: ${WHITE};
`;

const KebabButton = styled(Kebab)<{ $isHovered: boolean }>`
  display: flex;
  width: ${({ $isHovered }) => ($isHovered ? '0' : '20px')};
  height: 20px;
  stroke: ${GRAY.DARK};
  cursor: pointer;
  transition: width 0.1s ease-in-out;
`;

const EditDeleteButtons = styled.div<{ $isHovered: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: ${({ $isHovered }) => ($isHovered ? '80px' : '0')};
  transition: width 0.1s ease-in-out;
`;

const EditButton = styled(Pencil)`
  display: flex;
  width: 18px;
  height: 18px;
  stroke: ${GRAY.DARK};
  border-radius: 5px;
  cursor: pointer;
  padding: 1px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const DeleteButton = styled(Trash)`
  display: flex;
  width: 18px;
  height: 18px;
  stroke: ${DESTRUCTIVE.DEFAULT};
  border-radius: 5px;
  cursor: pointer;
  padding: 1px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
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

type EditDeleteModalProps = {
  onClickEdit: (...args: any[]) => void;
  onClickDelete: (...args: any[]) => void;
  onClickAdd: (...args: any[]) => void;
};

const GroupEditButtonList = ({
  onClickEdit,
  onClickDelete,
  onClickAdd,
}: EditDeleteModalProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <ButtonContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Kebab 버튼 */}
      <KebabButton $isHovered={isHovered} />

      {/* 수정/삭제 버튼 */}
      <EditDeleteButtons $isHovered={isHovered}>
        <EditButton onClick={onClickEdit} />
        <DeleteButton onClick={onClickDelete} />
        <PlusButton onClick={onClickAdd} />
      </EditDeleteButtons>
    </ButtonContainer>
  );
};

export default GroupEditButtonList;
