import React from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import RadioButtonList, {
  RadioButtonProps,
} from '@/components/atoms/common/radio-button/radio-button-list';

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
