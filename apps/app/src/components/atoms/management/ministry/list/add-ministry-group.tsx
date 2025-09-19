import React, { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';
import { Button, MainInput } from '@mokjang/components';
import { BLACK, GRAY, MAIN, WHITE } from '@mokjang/constants';
import { getIsWellFormedTitle } from '@mokjang/utils';

import { Svg } from '@mokjang/assets';
import { useScopedI18n } from '../../../../../../locales/client';

const BackgroundContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
`;

const AddMinistryGroupContainer = styled.div<{ $level: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: ${({ $level }) => `10px 10px 10px ${$level * 30}px`};
  width: 100%;
  gap: 10px;
`;

const CheckButton = styled(Svg.Check)<{ $isEnabled: boolean }>`
  display: block;
  width: 20px;
  height: 20px;
  padding: 2px;
  stroke: ${WHITE};
  stroke-width: 2px;
  border-radius: 5px;
  background-color: ${({ $isEnabled }) =>
    $isEnabled ? MAIN.DEFAULT : GRAY.SEMI_LIGHT};
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'default')};
  flex-shrink: 0;
`;

type AddMinistryGroupProps = {
  isShown: boolean;
  level: number;
  name: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveGroup: () => void;
};

const AddMinistryGroup = forwardRef<HTMLInputElement, AddMinistryGroupProps>(
  ({ isShown, level, name, onChangeName, onClickSaveGroup }, ref) => {
    const t_placeholder = useScopedI18n('placeholder');
    const t_button = useScopedI18n('button');
    return (
      <BackgroundContainer $isShown={isShown}>
        <AddMinistryGroupContainer $level={level + 1}>
          <MainInput
            ref={ref}
            value={name}
            onChange={onChangeName}
            height={10}
            color={BLACK}
            placeholder={t_placeholder('ministryGroupName')}
          />
          <Button
            onClick={onClickSaveGroup}
            width={'auto'}
            text={t_button('add')}
            borderColor={GRAY.LIGHT}
            backgroundColor={
              getIsWellFormedTitle(name) ? MAIN.DEFAULT : GRAY.SEMI_LIGHT
            }
            color={WHITE}
            height={30}
            disabled={!getIsWellFormedTitle(name)}
          />
        </AddMinistryGroupContainer>
      </BackgroundContainer>
    );
  }
);

export default AddMinistryGroup;
