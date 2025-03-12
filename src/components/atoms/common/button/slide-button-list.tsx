import styled from 'styled-components';
import React, { useState } from 'react';
import { DESTRUCTIVE, GRAY } from '@/constants/styles/color';
import Kebab from '../../../../../public/svg/kebab.svg';
import Trash from '../../../../../public/svg/trash.svg';
import Pencil from '../../../../../public/svg/pencil.svg';
import Plus from '../../../../../public/svg/plus.svg';

const ListContainer = styled.div<{ $position: string; $right: number }>`
  display: flex;
  position: ${({ $position }) => $position};
  right: ${({ $right }) => `${$right}px`};
  border-radius: 5px;
`;

// Kebab 버튼
const KebabButton = styled(Kebab)<{ $isOpened: boolean; $buttonSize: number }>`
  display: flex;
  width: ${({ $isOpened, $buttonSize }) => ($isOpened ? '0' : $buttonSize)}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${GRAY.DARK};
  cursor: pointer;
  transition: width 0.1s ease-in-out;
`;

// 버튼들이 들어갈 컨테이너
const ButtonContainer = styled.div<{
  $isOpened: boolean;
  $buttonCount: number;
  $buttonSize: number;
  $backgroundColor?: string;
}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden; // width가 작아질 때 아이콘이 안 보이는 효과

  // hover 상태일 때만 총 너비를 버튼 개수 × 버튼 크기 + 간격으로 계산
  width: ${({ $isOpened, $buttonCount, $buttonSize }) =>
    $isOpened
      ? `${$buttonCount * $buttonSize + Math.max($buttonCount - 1, 0) * 10}px`
      : '0'};
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: ${({ $backgroundColor }) => $backgroundColor || 'auto'};
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
  backgroundColor?: string;
  position?: string;
  right?: number;
};

const SlideButtonList = ({
  onClickEdit,
  onClickDelete,
  onClickAdd,
  isEditShown = true,
  isDeleteShown = true,
  isAddShown = true,
  buttonSize = 18,
  backgroundColor,
  position = 'absolute',
  right = 0,
}: EditDeleteModalProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  // 현재 몇 개의 버튼이 표시되는지를 계산
  const buttonCount =
    (isEditShown ? 1 : 0) + (isDeleteShown ? 1 : 0) + (isAddShown ? 1 : 0);

  return (
    <ListContainer
      $position={position}
      $right={right}
      onClick={(event) => {
        event.stopPropagation();
        setIsOpened(true);
      }}
      onMouseLeave={() => setIsOpened(false)}
    >
      {/* Kebab 버튼 (hover 전에는 보이고, hover 후에는 사라짐) */}
      <KebabButton $isOpened={isOpened} $buttonSize={buttonSize} />

      {/* 수정/삭제/추가 버튼 */}
      <ButtonContainer
        $isOpened={isOpened}
        $buttonCount={buttonCount}
        $buttonSize={buttonSize}
        $backgroundColor={backgroundColor}
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
