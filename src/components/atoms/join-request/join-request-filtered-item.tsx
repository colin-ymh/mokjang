import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { BLANK } from '@/constants/constant';
import { MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

import { useI18n } from '../../../../locales/client';
import Cancel from '../../../../public/svg/cancel.svg';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinRequestFilter } from '@/redux/reducers/filter/join-request-filter-reducer';

import { JOIN_REQUEST_STATUS } from '@/constants/status/status';
import { JOIN_REQUEST } from '@/constants/join-request/join-request-column';

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

export type JoinRequestFilteredItemType = {
  title: JOIN_REQUEST.NAME | JOIN_REQUEST.STATUS | JOIN_REQUEST.CREATED_AT;
  value: string[];
};

type JoinRequestFilteredItemProps = {
  item: JoinRequestFilteredItemType;
};

const JoinRequestFilteredItem = ({ item }: JoinRequestFilteredItemProps) => {
  const t = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { joinRequestFilter } = useSelector(
    (state: RootState) => state.joinRequestFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === JOIN_REQUEST.CREATED_AT) {
      dispatch(
        setJoinRequestFilter({
          ...joinRequestFilter,
          fromCreatedAt: BLANK,
          toCreatedAt: BLANK,
        })
      );
    } else if ([JOIN_REQUEST.NAME].includes(item.title)) {
      dispatch(
        setJoinRequestFilter({ ...joinRequestFilter, [item.title]: BLANK })
      );
    } else {
      dispatch(
        setJoinRequestFilter({ ...joinRequestFilter, [item.title]: [] })
      );
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case JOIN_REQUEST.STATUS:
        currentItem = item.value
          .map((status) => t(status as JOIN_REQUEST_STATUS))
          .join(', ');
        break;
      case JOIN_REQUEST.NAME:
        currentItem = item.value[0];
        break;
      case JOIN_REQUEST.CREATED_AT:
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

export default JoinRequestFilteredItem;
