'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { MainText, RequiredMark } from '@mokjang/components';
import Dropdown, { DropdownProps } from './dropdown';
import { FLEX_DIRECTION, GRAY, SIZE } from '@mokjang/constants';

const LabelDropdownContainer = styled.div<{
  $flexDirection: FLEX_DIRECTION;
}>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  align-items: ${({ $flexDirection }) =>
    $flexDirection === FLEX_DIRECTION.ROW ? 'center' : null};
  width: 100%;
  gap: 8px;
`;

type LabelDropdownProps = DropdownProps & {
  label: string;
  flexDirection?: FLEX_DIRECTION;
  isRequired?: boolean;
};

const LabelDropdown = forwardRef<HTMLInputElement, LabelDropdownProps>(
  (
    {
      label,
      flexDirection = FLEX_DIRECTION.COLUMN,
      // DropdownProps
      value,
      onChangeItem,
      items,
      isRequired = false,
      ...dropdownProps
    },
    ref
  ) => {
    return (
      <LabelDropdownContainer $flexDirection={flexDirection}>
        <MainText color={GRAY.DARK} size={SIZE.SMALL}>
          {label}
          {isRequired && <RequiredMark />}
        </MainText>
        <Dropdown
          ref={ref}
          value={value}
          items={items}
          onChangeItem={onChangeItem}
          {...dropdownProps}
        />
      </LabelDropdownContainer>
    );
  }
);

LabelDropdown.displayName = 'LabelDropdown';
export default LabelDropdown;
