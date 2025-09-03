import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '../../common/text/main-text';
import { USER } from '../../../../constants/column/user-column';
import { BLANK } from '../../../../constants/constant';
import { MAIN, WHITE } from '../../../../constants/styles/color';
import { SIZE } from '../../../../constants/styles/style';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import { AppDispatch, RootState } from '../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setChurchUserFilter } from '../../../../redux/reducers/filter/church-user-filter-reducer';

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

export type UserFilteredItemType = {
  title: USER.NAME;
  value: string[];
};

type UserFilteredItemProps = {
  item: UserFilteredItemType;
};

const ChurchUserFilteredItem = ({ item }: UserFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { churchUserFilter } = useSelector(
    (state: RootState) => state.churchUserFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if ([USER.NAME].includes(item.title)) {
      dispatch(
        setChurchUserFilter({ ...churchUserFilter, [item.title]: BLANK })
      );
    }
    // else {
    //   dispatch(setChurchUserFilter({ ...churchUserFilter, [item.title]: [] }));
    // }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case USER.NAME:
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

export default ChurchUserFilteredItem;
