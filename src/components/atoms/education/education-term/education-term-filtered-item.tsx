import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import { MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

import Cancel from '../../../../../public/svg/cancel.svg';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { EDUCATION_TERM } from '@/constants/education/education-term-column';
import { useI18n } from '../../../../../locales/client';
import { setEducationTermFilter } from '@/redux/reducers/education-term-filter-reducer';

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

export type EducationTermFilteredItemType = {
  title: EDUCATION_TERM.EDUCATION | EDUCATION_TERM.PERIOD;
  value: string[];
};

type EducationTermFilteredItemProps = {
  item: EducationTermFilteredItemType;
};

const EducationTermFilteredItem = ({
  item,
}: EducationTermFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { educationTermFilter } = useSelector(
    (state: RootState) => state.educationTermFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === EDUCATION_TERM.PERIOD) {
      // dispatch(
      //   setEducationTermFilter({
      //     ...educationTermFilter,
      //     fromEducationTermDate: BLANK,
      //     toEducationTermDate: BLANK,
      //   })
      // );
    } else if ([EDUCATION_TERM.EDUCATION].includes(item.title)) {
      dispatch(
        setEducationTermFilter({ ...educationTermFilter, [item.title]: BLANK })
      );
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      // case EDUCATION_TERM.STATUS:
      //   currentItem = item.value
      //     .map((status) => t(status as EDUCATION_TERM_STATUS))
      //     .join(', ');
      //   break;
      // case EDUCATION_TERM.METHOD:
      //   currentItem = item.value
      //     .map((method) => t(method as EDUCATION_TERM_METHOD))
      //     .join(', ');
      //   break;
      // case EDUCATION_TERM.TYPE: {
      //   // 여러 그룹 ID가 배열로 넘어온 경우
      //   currentItem = item.value
      //     .map((type) => t(type as EDUCATION_TERM_TYPE))
      //     .join(', ');
      //
      //   break;
      // }
      case EDUCATION_TERM.EDUCATION:
        currentItem = item.value[0];
        break;
      case EDUCATION_TERM.PERIOD:
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

export default EducationTermFilteredItem;
