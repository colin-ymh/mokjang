import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { BLANK } from '@mokjang/constants';
import { MAIN, WHITE } from '@mokjang/constants';
import { SIZE } from '@mokjang/constants';

import { useI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import { AppDispatch, RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setEducationFilter } from '../../../../redux/reducers/filter/education-filter-reducer';

import { EDUCATION } from '@mokjang/constants';

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

export type EducationFilteredItemType = {
  title: EDUCATION.NAME;
  value: string[];
};

type EducationFilteredItemProps = {
  item: EducationFilteredItemType;
};

const EducationFilteredItem = ({ item }: EducationFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { educationFilter } = useSelector(
    (state: RootState) => state.educationFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if ([EDUCATION.NAME].includes(item.title)) {
      dispatch(setEducationFilter({ ...educationFilter, [item.title]: BLANK }));
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case EDUCATION.NAME:
        currentItem = item.value[0];
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

export default EducationFilteredItem;
