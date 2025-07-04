import React, { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';

import VehicleNumberInputView, {
  VehicleNumberInputRef,
} from '@/components/atoms/register/vehicle-number-input.view';

type VehicleNumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  value: string[];
  onChangeInput: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  height?: number;
  width?: number;
  borderColor?: string;
};

const VehicleNumberInput = forwardRef<
  VehicleNumberInputRef,
  VehicleNumberInputProps
>(
  (
    { label, value, onChangeInput, height, width, borderColor, ...inputProps },
    ref
  ) => {
    const props = {
      label,
      value,
      onChangeInput,
      ...inputProps,
      height,
      width,
      borderColor,
    };

    return <VehicleNumberInputView ref={ref} {...props} />;
  }
);

export default VehicleNumberInput;
