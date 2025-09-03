import React from 'react';
import styled from 'styled-components';
import { CURSOR, GRAY } from '@mokjang/constants';

const StyledIcon = styled.svg<{
  $color?: string;
  $size?: number;
  width?: number;
  $isButton?: boolean;
  cursor?: CURSOR;
  bottom?: number;
}>`
  position: relative;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  stroke: ${({ $color }) => $color || 'currentColor'};
  stroke-width: ${({ width }) => width}px;
  color: ${({ $color }) => $color || 'currentColor'};
  cursor: ${({ $isButton, cursor }) =>
    cursor || $isButton ? 'pointer' : 'default'};
  bottom: ${({ bottom }) => bottom}px;

  &:hover {
    background-color: ${({ $isButton }) => $isButton && GRAY.LIGHT};
    border-radius: 5px;
  }
`;

type IconProps = {
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size?: number;
  color?: string;
  width?: number;
  onClick?: () => void;
  cursor?: CURSOR;
  bottom?: number;
};

const SvgIcon = ({
  svg: SvgComponent,
  size = 14,
  color,
  width = 1.5,
  onClick,
  cursor,
  bottom,
}: IconProps) => {
  return (
    <StyledIcon
      as={SvgComponent}
      $size={size}
      $color={color}
      width={width}
      onClick={onClick}
      cursor={cursor}
      $isButton={!!onClick}
      bottom={bottom}
    />
  );
};

export default SvgIcon;
