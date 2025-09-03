import React from 'react';
import styled from 'styled-components';

import { MainText } from '../text/main-text';
import RadioButtonList, { RadioButtonProps } from './radio-button-list';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

const RadioButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

type LabelRadioButtonProps = RadioButtonProps & {
  label: string;
};

const LabelRadioButton = ({
  label,
  items,
  selectedValue,
  onChange,
  customButton,
}: LabelRadioButtonProps) => {
  return (
    <RadioButtonContainer>
      <MainText color={GRAY.DARK} size={SIZE.SMALL}>
        {label}
      </MainText>
      <RadioButtonList
        items={items}
        selectedValue={selectedValue}
        onChange={onChange}
        customButton={customButton}
      />
    </RadioButtonContainer>
  );
};

export default LabelRadioButton;
