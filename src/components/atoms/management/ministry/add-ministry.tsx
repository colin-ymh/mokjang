import React, { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';

import MainInput from '@/components/atoms/common/input/main-input';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { getIsWellFormedTitle } from '@/utils/check';

import Check from '../../../../../public/svg/check.svg';
import { useI18n } from '../../../../../locales/client';

const AddMinistryContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  justify-content: flex-end;
  align-items: center;
  position: relative;
  gap: 10px;
  width: 100%;
  padding: 5px 0;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const CheckButton = styled(Check)<{ $isEnabled: boolean }>`
  display: flex;
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

type AddMinistryProps = {
  isShown: boolean;
  name: string;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveMinistry: () => void;
};

const AddMinistry = forwardRef<HTMLInputElement, AddMinistryProps>(
  ({ isShown, name, onChangeName, onClickSaveMinistry }, ref) => {
    const t = useI18n();

    return (
      <AddMinistryContainer $isShown={isShown}>
        <MainInput
          ref={ref}
          value={name}
          onChange={onChangeName}
          height={10}
          color={BLACK}
          placeholder={t('placeholder.ministryName')}
        />
        <CheckButton
          $isEnabled={getIsWellFormedTitle(name)}
          onMouseDown={onClickSaveMinistry}
        />
      </AddMinistryContainer>
    );
  }
);

export default AddMinistry;
