import styled from 'styled-components';
import React, { useState } from 'react';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

import Kebab from '../../../../../public/svg/kebab.svg';
import { useScopedI18n } from '../../../../../locales/client';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';

const ListContainer = styled.div<{
  $position: string;
  top: number;
  right: number;
}>`
  display: flex;
  position: ${({ $position }) => $position};
  right: ${({ right }) => right}px;
  top: ${({ top }) => top}px;
  border-radius: 5px;
`;

// Kebab 버튼
const KebabButton = styled(Kebab)<{ $buttonSize: number }>`
  display: flex;
  width: ${({ $buttonSize }) => $buttonSize}px;
  height: ${({ $buttonSize }) => $buttonSize}px;
  stroke: ${GRAY.DARK};
  cursor: pointer;
  position: relative;
`;

// 버튼들이 들어갈 컨테이너
const Dropdown = styled.div<{
  $isOpened: boolean;
}>`
  display: ${({ $isOpened }) => ($isOpened ? 'flex' : 'none')};
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
  position: absolute;
  top: 35px;
  right: 0;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const DropdownButton = styled.div`
  display: flex;
  padding: 5px;
`;

const ButtonItem = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type EditDeleteModalProps = {
  onClickEdit?: (...args: any[]) => void;
  onClickDelete?: (...args: any[]) => void;
  onClickAdd?: (...args: any[]) => void;
  buttonSize?: number;
  top?: number;
  right?: number;
  position?: string;
};

const SlideButtonList = ({
  onClickEdit,
  onClickDelete,
  onClickAdd,
  buttonSize = 18,
  top = 0,
  right = 0,
  position = 'absolute',
}: EditDeleteModalProps) => {
  const t_button = useScopedI18n('button');
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const onClickKebab = () => {
    setIsOpened(!isOpened);
  };

  return (
    <ListContainer $position={position} top={top} right={right}>
      <TransparentBackground
        isOpened={isOpened}
        onClick={() => setIsOpened(false)}
      />
      {/* Kebab 버튼 (hover 전에는 보이고, hover 후에는 사라짐) */}
      <KebabButton $buttonSize={buttonSize} onClick={onClickKebab} />
      {/* 수정/삭제/추가 버튼 */}
      <Dropdown $isOpened={isOpened}>
        <DropdownButton>
          <ButtonItem onClick={onClickDelete}>
            <MainText>{t_button('delete')}</MainText>
          </ButtonItem>
        </DropdownButton>
      </Dropdown>
    </ListContainer>
  );
};

export default SlideButtonList;
