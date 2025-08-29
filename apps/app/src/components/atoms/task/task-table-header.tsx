import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

import { MainText } from '../common/text/main-text';
import { TASK } from '../../../constants/column/task-column';
import { BLACK, GRAY, MAIN } from '../../../constants/styles/color';
import { SIZE } from '../../../constants/styles/style';
import { getTranslatedTaskColumn } from '../../../utils/translate';
import { useI18n } from '../../../../locales/client';
import Arrow from '../../../../public/svg/arror-up.svg';
import ArrowUpDown from '../../../../public/svg/arrow-up-down.svg';
import { ORDER_DIRECTION } from '../../../constants/constant';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  gap: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ArrowUp = styled(Arrow)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
`;

const ArrowDown = styled(Arrow)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(180deg);
`;

const ArrowUpDownIcon = styled(ArrowUpDown)`
  width: 14px;
  height: 14px;
  stroke-width: 2px;
  stroke: ${GRAY.DEFAULT};
`;

type TaskTableHeaderProps = {
  item: {
    id: TASK;
    isSortable: boolean;
  };
  onClick: (id: TASK) => void;
};

// Component
const TaskTableHeader = ({ item, onClick }: TaskTableHeaderProps) => {
  const { taskOrderBy, taskOrderDirection } = useSelector(
    (state: RootState) => state.taskFilter
  );
  const t = useI18n();
  const isActive = taskOrderBy === item.id;

  return (
    <HeaderContainer onClick={() => item.isSortable && onClick(item.id)}>
      <TextContainer>
        <MainText
          color={isActive ? BLACK : GRAY.DARK}
          size={SIZE.SMALL}
          fontWeight={600}
        >
          {getTranslatedTaskColumn(t, item.id)}
        </MainText>
      </TextContainer>
      {item.isSortable && (
        <IconContainer>
          {taskOrderBy !== item.id ? (
            <ArrowUpDownIcon />
          ) : taskOrderDirection === ORDER_DIRECTION.ASC ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )}
        </IconContainer>
      )}
    </HeaderContainer>
  );
};

export default TaskTableHeader;
