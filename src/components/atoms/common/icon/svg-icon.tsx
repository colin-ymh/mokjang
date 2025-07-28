import React from 'react';
import styled from 'styled-components';
import { GRAY } from '@/constants/styles/color';

const StyledIcon = styled.svg<{
  $color?: string;
  $size?: number;
  width?: number;
  $isButton?: boolean;
}>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  stroke: ${({ $color }) => $color || 'currentColor'};
  stroke-width: ${({ width }) => width}px;
  color: ${({ $color }) => $color || 'currentColor'};
  cursor: ${({ $isButton }) => ($isButton ? 'pointer' : 'default')};

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
};

const SvgIcon = ({
  svg: SvgComponent,
  size = 14,
  color,
  width = 1.5,
  onClick,
}: IconProps) => {
  return (
    <StyledIcon
      as={SvgComponent}
      $size={size}
      $color={color}
      width={width}
      onClick={onClick}
      $isButton={!!onClick}
    />
  );
};

export default SvgIcon;
