import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { TASK } from '@/constants/task/task-column';
import { BLANK } from '@/constants/constant';
import { MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

import { useI18n } from '../../../../locales/client';
import Cancel from '../../../../public/svg/cancel.svg';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskFilter } from '@/redux/reducers/task-filter-reducer';
import { TASK_STATUS } from '@/models/task/task';

const ItemContainer = styled.div`
  display: flex;
  border-radius: 5px;
  height: 30px;
  justify-content: center;
  align-items: center;
  padding: 0 5px;
  background-color: ${MAIN.LIGHT};
  gap: 5px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CancelButton = styled(Cancel)`
  width: 15px;
  height: 15px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

export type TaskFilteredItemType = {
  title: TASK.TITLE | TASK.STATUS | TASK.DATE | TASK.IN_CHARGE;
  value: string[];
};

type TaskFilteredItemProps = {
  item: TaskFilteredItemType;
};

const TaskFilteredItem = ({ item }: TaskFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { taskFilter } = useSelector((state: RootState) => state.taskFilter);

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === TASK.DATE) {
      dispatch(
        setTaskFilter({
          ...taskFilter,
          fromTaskDate: BLANK,
          toTaskDate: BLANK,
        })
      );
    } else if ([TASK.TITLE, TASK.IN_CHARGE].includes(item.title)) {
      dispatch(setTaskFilter({ ...taskFilter, [item.title]: BLANK }));
    } else {
      dispatch(setTaskFilter({ ...taskFilter, [item.title]: [] }));
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case TASK.STATUS:
        currentItem = item.value
          .map((status) => t(status as TASK_STATUS))
          .join(', ');
        break;
      case TASK.TITLE:
        currentItem = item.value[0];
        break;
      case TASK.DATE:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;
      default:
        currentItem = item.value[0];
        return;
    }

    if (currentItem) {
      setValueText(currentItem);
    }
  }, []);

  return (
    <ItemContainer>
      <TextContainer>
        <MainText color={WHITE}>{t(item.title)}</MainText>
        <MainText color={WHITE} size={SIZE.EXTRA_SMALL}>
          {'>'}
        </MainText>
        <MainText color={WHITE}>{valueText}</MainText>
      </TextContainer>
      <ButtonContainer onClick={onClickCancel}>
        <CancelButton />
      </ButtonContainer>
    </ItemContainer>
  );
};

export default TaskFilteredItem;
