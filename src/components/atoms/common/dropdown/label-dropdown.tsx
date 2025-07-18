'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import Dropdown, {
  DropdownProps,
} from '@/components/atoms/common/dropdown/dropdown';
import { FLEX_DIRECTION } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';

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
      ...dropdownProps
    },
    ref
  ) => {
    return (
      <LabelDropdownContainer $flexDirection={flexDirection}>
        <MainText color={GRAY.SEMI_DARK}>{label}</MainText>
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
