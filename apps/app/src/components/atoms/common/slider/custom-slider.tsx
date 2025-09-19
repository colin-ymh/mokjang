import { GRAY, MAIN } from '@mokjang/constants';
import React from 'react';
import styled from 'styled-components';

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const SliderWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  height: 10px;
  width: 100%;
`;

const Thumb = styled.input`
  pointer-events: none;
  position: absolute;
  height: 4px;
  width: 100%;
  background: transparent;
  appearance: none;
  left: -2px;
  &::-webkit-slider-thumb {
    pointer-events: auto;
    position: relative;
    appearance: none;
    height: 16px;
    width: 16px;
    background-color: ${MAIN.DEFAULT};
    border-radius: 50%;
    cursor: pointer;
    z-index: 2;
  }
`;

const Track = styled.div<{ left: number; right: number }>`
  position: absolute;
  height: 4px;
  width: 100%;
  background-color: ${GRAY.SEMI_LIGHT};
  border-radius: 2px;

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    left: ${({ left }) => `${left}%`};
    right: ${({ right }) => `${100 - right}%`};
    background-color: ${MAIN.DEFAULT};
    border-radius: 2px;
  }
`;

type CustomSliderProps = {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
};

const CustomSlider = ({
  min,
  max,
  step = 1,
  values,
  onChange,
}: CustomSliderProps) => {
  const [minVal, maxVal] = values;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    onChange([value, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    onChange([minVal, value]);
  };

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <SliderContainer>
      {/* 슬라이더 바 (회색) */}
      <SliderWrapper>
        {/* 슬라이더 바 (파란색) */}
        <Track left={getPercent(minVal)} right={getPercent(maxVal)} />
        {/* 최소값 핸들 */}
        <Thumb
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
        />
        {/* 최대값 핸들 */}
        <Thumb
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
        />
      </SliderWrapper>
    </SliderContainer>
  );
};

export default CustomSlider;
