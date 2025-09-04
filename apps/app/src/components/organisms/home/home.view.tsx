import React from 'react';
import styled from 'styled-components';
import { MAIN, WHITE } from '@mokjang/constants';
import HomeWidgetList from '../../molecules/home/list/home-widget-list';

import { Svg } from '@mokjang/assets';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const FABContainer = styled.div`
  position: fixed;
  display: flex;
  right: 100px;
  bottom: 100px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  background-color: ${MAIN.DEFAULT};
  width: 50px;
  height: 50px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  &:active {
    transform: scale(0.98); /* 클릭하면 작아지는 효과 */
    box-shadow: none; /* 클릭 시 그림자 제거로 눌린 느낌 */
  }
`;

const PlusButton = styled(Svg.Plus)`
  width: 30px;
  height: 30px;
  cursor: pointer;
  stroke: ${WHITE};
`;

type HomeViewProps = {
  onClickAdd: () => void;
};

const HomeView = ({ onClickAdd }: HomeViewProps) => {
  return (
    <HomeContainer>
      {/* 위젯 목록 */}
      <HomeWidgetList />
      {/* 위젯 추가 버튼 */}
      <FABContainer>
        <PlusButton onClick={onClickAdd} />
      </FABContainer>
    </HomeContainer>
  );
};

export default HomeView;
