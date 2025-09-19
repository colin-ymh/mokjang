import React, { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';
import { Button, MainInput } from '@mokjang/components';
import { BLACK, GRAY, MAIN, WHITE } from '@mokjang/constants';
import { getIsWellFormedTitle } from '@mokjang/utils';
import { useScopedI18n } from '../../../../../../locales/client';

const BackgroundContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
`;

const AddGroupContainer = styled.div<{ $level: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: ${({ $level }) => `10px 10px 10px ${$level * 30}px`};
  width: 100%;
  gap: 10px;
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
    const t_button = useScopedI18n('button');
    return (
      <BackgroundContainer $isShown={isShown}>
        <AddGroupContainer $level={level + 1}>
          <MainInput
            ref={ref}
            value={name}
            onChange={onChangeName}
            height={10}
            color={BLACK}
            placeholder={t_placeholder('groupName')}
          />
          <Button
            onClick={onClickSaveGroup}
            width={'auto'}
            text={t_button('add')}
            borderColor={GRAY.SEMI_LIGHT}
            backgroundColor={
              getIsWellFormedTitle(name) ? MAIN.DEFAULT : GRAY.SEMI_LIGHT
            }
            color={WHITE}
            height={30}
            disabled={!getIsWellFormedTitle(name)}
          />
        </AddGroupContainer>
      </BackgroundContainer>
    );
  }
);

export default AddGroup;
