import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/member/member-column';
import { BLANK, GENDER, MARRIAGE } from '@/constants/constant';
import { MAIN, WHITE } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import {
  setFilterAfter,
  setFilterBefore,
  setFilterItems,
  setMemberFilter,
} from '@/redux/reducers/member-filter-reducer';

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

export type FilteredItemType = {
  title:
    | MEMBER.GENDER
    | MEMBER.GROUP
    | MEMBER.MINISTRIES
    | MEMBER.OFFICER
    | MEMBER.EDUCATIONS
    | MEMBER.MARRIAGE
    | MEMBER.BAPTISM
    | MEMBER.BIRTH_AFTER
    | MEMBER.BIRTH_BEFORE
    | MEMBER.REGISTER_AFTER
    | MEMBER.REGISTER_BEFORE
    | MEMBER.UPDATE_AFTER
    | MEMBER.UPDATE_BEFORE
    | MEMBER.NAME
    | MEMBER.VEHICLE_NUMBER
    | MEMBER.SCHOOL
    | MEMBER.OCCUPATION;
  value: string;
};

type FilteredItemProps = {
  item: FilteredItemType;
};

const FilteredItem = ({ item }: FilteredItemProps) => {
  const t = useI18n();
  const { groups, officers, ministries, educations } = useSelector(
    (state: RootState) => state.church
  );
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter, filterValue } = useSelector(
    (state: RootState) => state.memberFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (
      [
        MEMBER.BIRTH_AFTER,
        MEMBER.BIRTH_BEFORE,
        MEMBER.REGISTER_AFTER,
        MEMBER.REGISTER_BEFORE,
        MEMBER.UPDATE_AFTER,
        MEMBER.UPDATE_BEFORE,
      ].includes(item.title)
    ) {
      dispatch(setMemberFilter({ ...memberFilter, [item.title]: BLANK }));
      if (item.title.includes('After')) {
        dispatch(setFilterAfter(BLANK));
      } else if (item.title.includes('Before')) {
        dispatch(setFilterBefore(BLANK));
      }
    } else if (
      [
        MEMBER.NAME,
        MEMBER.SCHOOL,
        MEMBER.OCCUPATION,
        MEMBER.VEHICLE_NUMBER,
      ].includes(item.title)
    ) {
      dispatch(setMemberFilter({ ...memberFilter, [item.title]: BLANK }));
    } else {
      const newItems = (memberFilter[item.title] as string[]).filter(
        (i) => i !== item.value
      );
      dispatch(setMemberFilter({ ...memberFilter, [item.title]: newItems }));

      // 현재 필터 설정 중이었다면
      // 삭제된 내용을 적용
      if (filterValue === item.title) {
        dispatch(setFilterItems(newItems));
      }
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case MEMBER.GENDER:
        currentItem = t(item.value as GENDER);
        break;
      case MEMBER.MARRIAGE:
        currentItem = t(item.value as MARRIAGE);
        break;
      case MEMBER.GROUP:
        currentItem = groups.find((group) => group.id === item.value)?.name;
        break;
      case MEMBER.OFFICER:
        currentItem = officers.find(
          (officer) => officer.id === item.value
        )?.name;
        break;
      case MEMBER.MINISTRIES:
        currentItem = ministries.find(
          (ministry) => ministry.id === item.value
        )?.name;
        break;
      case MEMBER.EDUCATIONS:
        currentItem = educations.find(
          (education) => education.id === item.value
        )?.name;
        break;
      case MEMBER.BIRTH_AFTER:
        currentItem = item.value;
        break;
      case MEMBER.BIRTH_BEFORE:
        currentItem = item.value;
        break;
      case MEMBER.REGISTER_AFTER:
        currentItem = item.value;
        break;
      case MEMBER.REGISTER_BEFORE:
        currentItem = item.value;
        break;
      case MEMBER.UPDATE_AFTER:
        currentItem = item.value;
        break;
      case MEMBER.UPDATE_BEFORE:
        currentItem = item.value;
        break;
      case MEMBER.NAME:
        currentItem = item.value;
        break;
      case MEMBER.SCHOOL:
        currentItem = item.value;
        break;
      case MEMBER.OCCUPATION:
        currentItem = item.value;
        break;
      case MEMBER.VEHICLE_NUMBER:
        currentItem = item.value;
        break;
      default:
        currentItem = item.value;
        return;
    }

    if (currentItem) {
      setValueText(currentItem);
    }
  }, [item.title, item.value, groups, officers, ministries, educations]);

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

export default FilteredItem;
