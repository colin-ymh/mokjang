'use client';

import React from 'react';
import styled from 'styled-components';
import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { useScopedI18n } from '../../../../locales/client';

const CIRCLE = 40; // 원 크기
const LINE_Y = CIRCLE / 2; // 라인이 지나갈 Y (원 중심)

const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start; /* 원을 위쪽에 고정 */
  padding: 0;
  isolation: isolate;
  width: 832px;
  height: 92px;
  position: relative;
`;

/** 라인 레일: 첫/마지막 원의 '중심'에서 시작/끝나도록 좌우 여백을 원 반지름만큼 */
const LineRail = styled.div`
  position: absolute;
  left: ${CIRCLE / 2}px;
  right: ${CIRCLE / 2}px;
  top: ${LINE_Y}px;
  height: 2px;
  z-index: 0;
`;

const LineBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: ${GRAY.EXTRA_LIGHT};
`;

const LineFill = styled.div<{ $ratio: number }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 2px;
  width: ${({ $ratio }) => `${$ratio * 100}%`};
  background: ${MAIN.DEFAULT};
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1; /* 라인 위로 */
`;

const Circle = styled.div<{ $status: 'past' | 'current' | 'future' }>`
  width: ${CIRCLE}px;
  height: ${CIRCLE}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  ${({ $status }) => {
    switch ($status) {
      case 'current':
        return `
          background: ${MAIN.DEFAULT};
          color: white;
          border: 2px solid ${MAIN.DEFAULT};
        `;
      case 'past':
        return `
          background: ${GRAY.DEFAULT};
          color: white;
          border: 2px solid ${GRAY.DEFAULT};
        `;
      default: // 'future'
        return `
          background: white;
          color: ${GRAY.DEFAULT};
          border: 2px solid ${GRAY.LIGHT};
        `;
    }
  }}
`;

const Title = styled.div<{ $active: boolean }>`
  margin-top: 8px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  color: ${({ $active }) => ($active ? BLACK : GRAY.DEFAULT)};
`;

export enum INIT_STEP {
  GROUP = 'group',
  OFFICER = 'officer',
  MINISTRY = 'ministry',
}

type ChurchInitBarProps = {
  currentPage: INIT_STEP;
};

const ChurchInitBar = ({ currentPage }: ChurchInitBarProps) => {
  const t_init = useScopedI18n('register.churchInit');

  const steps = [INIT_STEP.GROUP, INIT_STEP.OFFICER, INIT_STEP.MINISTRY];
  const idx = steps.indexOf(currentPage);
  const currentIndex = Math.max(0, idx); // 안전 처리
  const ratio = currentIndex / (steps.length - 1); // 0 ~ 1

  return (
    <Wrap>
      <LineRail>
        <LineBase />
        <LineFill $ratio={ratio} />
      </LineRail>

      {steps.map((s, i) => {
        const status: 'past' | 'current' | 'future' =
          i < currentIndex ? 'past' : i === currentIndex ? 'current' : 'future';

        return (
          <Step key={s}>
            <Circle $status={status}>{i + 1}</Circle>
            <Title $active={status === 'current'}>{t_init(`${s}.title`)}</Title>
          </Step>
        );
      })}
    </Wrap>
  );
};

export default ChurchInitBar;
