import styled from 'styled-components';
import { MainText } from '../text';
import { GRAY } from '@mokjang/constants';
import { SvgIcon } from '../svg-icon';
import React from 'react';

const TagContainer = styled.div<{
  $backgroundColor: string;
  $rowPadding: number;
  $columnPadding: number;
  gap: number;
}>`
  display: inline-flex;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 3px;
  padding: ${({ $columnPadding, $rowPadding }) =>
    `${$columnPadding}px ${$rowPadding}px`};
  gap: ${({ gap }) => gap}px;
  align-items: center;
`;

type MainTagProps = {
  title: string;
  backgroundColor?: string;
  color?: string;
  svg?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  rowPadding?: number;
  columnPadding?: number;
  gap?: number;
};

export const MainTag = ({
  title,
  backgroundColor = GRAY.EXTRA_LIGHT,
  color = GRAY.DEFAULT,
  svg,
  rowPadding = 8,
  columnPadding = 2,
  gap = 10,
}: MainTagProps) => {
  return (
    <TagContainer
      $backgroundColor={backgroundColor}
      $rowPadding={rowPadding}
      $columnPadding={columnPadding}
      gap={gap}
    >
      {svg && <SvgIcon svg={svg} color={color} />}
      <MainText color={color}>{title}</MainText>
    </TagContainer>
  );
};
