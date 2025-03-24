import React, { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';
import MainInput from '@/components/atoms/common/input/main-input';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { getIsWellFormedTitle } from '@/utils/check';

import Check from '../../../../../public/svg/check.svg';
import Plus from '../../../../../public/svg/plus.svg';
import { useScopedI18n } from '../../../../../locales/client';

const BackgroundContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  justify-content: flex-end;
  width: 100%;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const AddGroupContainer = styled.div<{ $level: number }>`
  display: flex;
  padding: 5px 0;
  justify-content: center;
  align-items: center;
  position: relative;
  //gap: 10px;

  width: ${({ $level }) => `${100 - $level * 10}%`};
`;

const PlusButton = styled(Plus)`
  display: flex;
  width: 25px;
  height: 25px;
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
`;

const CheckButton = styled(Check)<{ $isEnabled: boolean }>`
  display: block;
  width: 20px;
  height: 20px;
  padding: 2px;
  stroke: ${WHITE};
  stroke-width: 2px;
  border-radius: 5px;
  background-color: ${({ $isEnabled }) =>
    $isEnabled ? MAIN.DEFAULT : GRAY.LIGHT};
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'default')};
  flex-shrink: 0;
`;

type AddGroupProps = {
  isShown: boolean;
  level: number;
  name: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveGroup: () => void;
};

const AddGroup = forwardRef<HTMLInputElement, AddGroupProps>(
  ({ isShown, level, name, onChangeName, onClickSaveGroup }, ref) => {
    const t_placeholder = useScopedI18n('placeholder');
    return (
      <BackgroundContainer $isShown={isShown}>
        <AddGroupContainer $level={level + 1}>
          <PlusButton />
          <MainInput
            ref={ref}
            value={name}
            onChange={onChangeName}
            height={10}
            color={BLACK}
            placeholder={t_placeholder('groupName')}
          />
          <CheckButton
            $isEnabled={getIsWellFormedTitle(name)}
            onMouseDown={onClickSaveGroup}
          />
        </AddGroupContainer>
      </BackgroundContainer>
    );
  }
);

export default AddGroup;
