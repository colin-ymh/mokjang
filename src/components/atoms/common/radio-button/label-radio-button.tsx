import React from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import RadioButton, {
  RadioButtonProps,
} from '@/components/atoms/common/radio-button/radio-button';

const RadioButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  height: 40px;
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
      <MainText>{label}</MainText>
      <RadioButton
        items={items}
        selectedValue={selectedValue}
        onChange={onChange}
        customButton={customButton}
      />
    </RadioButtonContainer>
  );
};

export default LabelRadioButton;
