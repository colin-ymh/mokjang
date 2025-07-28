import styled from 'styled-components';
import ChevronLeft from '../../../../../public/svg/chevron-down.svg';
import { BLACK } from '@/constants/styles/color';

export const Chevron = styled(ChevronLeft)<{
  $isOpened: boolean;
  color?: string;
  $reverseDirection?: boolean;
}>`
  width: 14px;
  height: 14px;
  stroke: ${({ color }) => color || BLACK};
  stroke-width: 2px;
  position: absolute;
  right: ${({ $reverseDirection }) => ($reverseDirection ? 'auto' : '10px')};
  left: ${({ $reverseDirection }) => ($reverseDirection ? '10px' : 'auto')};
  top: 50%;
  transform: translateY(-50%)
    rotate(${({ $isOpened }) => ($isOpened ? '180deg' : '360deg')});
  transition: transform 0.2s ease;
`;
