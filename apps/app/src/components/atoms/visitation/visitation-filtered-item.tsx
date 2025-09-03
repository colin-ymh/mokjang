import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { VISITATION } from '@mokjang/constants';
import { BLANK } from '@mokjang/constants';
import { MAIN, WHITE } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';

import { useI18n } from '../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { VISITATION_METHOD, VISITATION_TYPE } from '@mokjang/models';
import { AppDispatch, RootState } from '../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setVisitationFilter } from '../../../redux/reducers/filter/visitation-filter-reducer';
import { TASK_STATUS } from '@mokjang/constants';

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

const CancelButton = styled(Svg.Cancel)`
  width: 15px;
  height: 15px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

export type VisitationFilteredItemType = {
  title:
    | VISITATION.TITLE
    | VISITATION.STATUS
    | VISITATION.METHOD
    | VISITATION.TYPE
    | VISITATION.DATE
    | VISITATION.IN_CHARGE;
  value: string[];
};

type VisitationFilteredItemProps = {
  item: VisitationFilteredItemType;
};

const VisitationFilteredItem = ({ item }: VisitationFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { visitationFilter } = useSelector(
    (state: RootState) => state.visitationFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === VISITATION.DATE) {
      dispatch(
        setVisitationFilter({
          ...visitationFilter,
          fromStartDate: BLANK,
          toStartDate: BLANK,
        })
      );
    } else if ([VISITATION.TITLE, VISITATION.IN_CHARGE].includes(item.title)) {
      dispatch(
        setVisitationFilter({ ...visitationFilter, [item.title]: BLANK })
      );
    } else {
      dispatch(setVisitationFilter({ ...visitationFilter, [item.title]: [] }));
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case VISITATION.STATUS:
        currentItem = item.value
          .map((status) => t(status as TASK_STATUS))
          .join(', ');
        break;
      case VISITATION.METHOD:
        currentItem = item.value
          .map((method) => t(method as VISITATION_METHOD))
          .join(', ');
        break;
      case VISITATION.TYPE: {
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((type) => t(type as VISITATION_TYPE))
          .join(', ');

        break;
      }
      case VISITATION.TITLE:
        currentItem = item.value[0];
        break;
      case VISITATION.DATE:
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

export default VisitationFilteredItem;
