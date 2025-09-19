import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { BLANK, MAIN, TASK, TASK_STATUS } from '@mokjang/constants';

import { useI18n } from '../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskFilter } from '../../../redux/reducers/filter/task-filter-reducer';

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${MAIN.EXTRA_LIGHT};
  border: 1px solid ${MAIN.LIGHT};
  gap: 15px;
  border-radius: 100px;
  padding: 5px 12px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CancelButton = styled(Svg.Cancel)`
  width: 12px;
  height: 12px;
  stroke: ${MAIN.DEFAULT};
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
          fromStartDate: BLANK,
          toStartDate: BLANK,
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
        <MainText color={MAIN.DARK}>{t(item.title)}</MainText>
        <MainText color={MAIN.DEFAULT}>{valueText}</MainText>
      </TextContainer>
      <ButtonContainer onClick={onClickCancel}>
        <CancelButton />
      </ButtonContainer>
    </ItemContainer>
  );
};

export default TaskFilteredItem;
