import styled from 'styled-components';
import React, { useState } from 'react';
import { DESTRUCTIVE, GRAY } from '@/constants/styles/color';
import Kebab from '../../../../../public/svg/kebab.svg';
import Trash from '../../../../../public/svg/trash.svg';
import Pencil from '../../../../../public/svg/pencil.svg';
import Plus from '../../../../../public/svg/plus.svg';

const ListContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  border-radius: 5px;
`;

// Kebab 버튼
const KebabButton = styled(Kebab)<{ $isHovered: boolean; $buttonSize: number }>`
  display: flex;
  width: ${({ $isHovered, $buttonSize }) => ($isHovered ? '0' : $buttonSize)}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${GRAY.DARK};
  cursor: pointer;
  transition: width 0.1s ease-in-out;
`;

// 버튼들이 들어갈 컨테이너
const ButtonContainer = styled.div<{
  $isHovered: boolean;
  $buttonCount: number;
  $buttonSize: number;
  $hoverBackgroundColor?: string;
}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden; // width가 작아질 때 아이콘이 안 보이는 효과

  // hover 상태일 때만 총 너비를 버튼 개수 × 버튼 크기 + 간격으로 계산
  width: ${({ $isHovered, $buttonCount, $buttonSize }) =>
    $isHovered
      ? `${$buttonCount * $buttonSize + Math.max($buttonCount - 1, 0) * 10}px`
      : '0'};
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: ${({ $hoverBackgroundColor }) =>
      $hoverBackgroundColor || 'auto'};
  }
`;

// 개별 버튼들
const EditButton = styled(Pencil)<{ $buttonSize: number }>`
  display: flex;
  width: ${({ $buttonSize }) => $buttonSize}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${GRAY.DARK};
  border-radius: 5px;
  cursor: pointer;
  padding: 1px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const DeleteButton = styled(Trash)<{ $buttonSize: number }>`
  display: flex;
  width: ${({ $buttonSize }) => $buttonSize}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${DESTRUCTIVE.DEFAULT};
  border-radius: 5px;
  cursor: pointer;
  padding: 1px;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const PlusButton = styled(Plus)<{ $buttonSize: number }>`
  display: flex;
  width: ${({ $buttonSize }) => $buttonSize}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
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
  onClickEdit?: (...args: any[]) => void;
  onClickDelete?: (...args: any[]) => void;
  onClickAdd?: (...args: any[]) => void;
  isEditShown?: boolean;
  isDeleteShown?: boolean;
  isAddShown?: boolean;
  buttonSize?: number;
  hoverBackgroundColor?: string;
};

const SlideButtonList = ({
  onClickEdit,
  onClickDelete,
  onClickAdd,
  isEditShown = true,
  isDeleteShown = true,
  isAddShown = true,
  buttonSize = 18,
  hoverBackgroundColor,
}: EditDeleteModalProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 현재 몇 개의 버튼이 표시되는지를 계산
  const buttonCount =
    (isEditShown ? 1 : 0) + (isDeleteShown ? 1 : 0) + (isAddShown ? 1 : 0);

  return (
    <ListContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Kebab 버튼 (hover 전에는 보이고, hover 후에는 사라짐) */}
      <KebabButton $isHovered={isHovered} $buttonSize={buttonSize} />

      {/* 수정/삭제/추가 버튼 */}
      <ButtonContainer
        $isHovered={isHovered}
        $buttonCount={buttonCount}
        $buttonSize={buttonSize}
        $hoverBackgroundColor={hoverBackgroundColor}
      >
        {isDeleteShown && (
          <DeleteButton onClick={onClickDelete} $buttonSize={buttonSize} />
        )}
        {isEditShown && (
          <EditButton onClick={onClickEdit} $buttonSize={buttonSize} />
        )}
        {isAddShown && (
          <PlusButton onClick={onClickAdd} $buttonSize={buttonSize} />
        )}
      </ButtonContainer>
    </ListContainer>
  );
};

export default SlideButtonList;
