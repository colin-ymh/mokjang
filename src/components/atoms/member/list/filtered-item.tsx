import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/column/member-column';
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
} from '@/redux/reducers/filter/member-filter-reducer';

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
    | MEMBER.BIRTH
    | MEMBER.REGISTERED_AT
    | MEMBER.UPDATED_AT
    | MEMBER.NAME
    | MEMBER.VEHICLE_NUMBER
    | MEMBER.SCHOOL
    | MEMBER.OCCUPATION
    | MEMBER.MOBILE_PHONE
    | MEMBER.HOME_PHONE
    | MEMBER.ADDRESS;
  value: string[];
};

type FilteredItemProps = {
  item: FilteredItemType;
};

const FilteredItem = ({ item }: FilteredItemProps) => {
  const t = useI18n();
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { groups, officers, ministries } = useSelector(
    (state: RootState) => state.church
  );
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter, filterValue } = useSelector(
    (state: RootState) => state.memberFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === MEMBER.BIRTH) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthAfter: BLANK,
          birthBefore: BLANK,
        })
      );
      if (filterValue === item.title) {
        dispatch(setFilterAfter(BLANK));
        dispatch(setFilterBefore(BLANK));
      }
    } else if (item.title === MEMBER.REGISTERED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          registerAfter: BLANK,
          registerBefore: BLANK,
        })
      );
      if (filterValue === item.title) {
        dispatch(setFilterAfter(BLANK));
        dispatch(setFilterBefore(BLANK));
      }
    } else if (item.title === MEMBER.UPDATED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          updateAfter: BLANK,
          updateBefore: BLANK,
        })
      );
      if (filterValue === item.title) {
        dispatch(setFilterAfter(BLANK));
        dispatch(setFilterBefore(BLANK));
      }
    } else if (
      [
        MEMBER.NAME,
        MEMBER.SCHOOL,
        MEMBER.OCCUPATION,
        MEMBER.VEHICLE_NUMBER,
        MEMBER.ADDRESS,
        MEMBER.MOBILE_PHONE,
        MEMBER.HOME_PHONE,
      ].includes(item.title)
    ) {
      dispatch(setMemberFilter({ ...memberFilter, [item.title]: BLANK }));
    } else {
      dispatch(setMemberFilter({ ...memberFilter, [item.title]: [] }));

      // 현재 필터 설정 중이었다면
      // 삭제된 내용을 적용
      if (filterValue === item.title) {
        dispatch(setFilterItems([]));
      }
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case MEMBER.GENDER:
        currentItem = item.value
          .map((gender) => t(gender as GENDER))
          .join(', ');
        break;
      case MEMBER.MARRIAGE:
        currentItem = item.value
          .map((marriage) => t(marriage as MARRIAGE))
          .join(', ');
        break;
      case MEMBER.GROUP: {
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((groupId) => groups.find((group) => group.id === groupId)?.name)
          .filter(Boolean) // undefined/null 필터링
          .join(', ');

        break;
      }
      case MEMBER.OFFICER:
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map(
            (officerId) =>
              officers.find((officer) => officer.id === officerId)?.name
          )
          .filter(Boolean)
          .join(', ');
        break;
      case MEMBER.MINISTRIES:
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map(
            (ministryId) =>
              ministries.find((ministry) => ministry.id === ministryId)?.name
          )
          .filter(Boolean) // undefined/null 필터링
          .join(', ');
        break;
      // case MEMBER.EDUCATIONS:
      //   // 여러 그룹 ID가 배열로 넘어온 경우
      //   currentItem = item.value
      //     .map(
      //       (educationId) =>
      //         educations.find((education) => education.id === educationId)?.name
      //     )
      //     .filter(Boolean) // undefined/null 필터링
      //     .join(', ');
      //   break;
      case MEMBER.BIRTH:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;
      case MEMBER.REGISTERED_AT:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;
      case MEMBER.UPDATED_AT:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;
      case MEMBER.NAME:
        currentItem = item.value[0];
        break;
      case MEMBER.SCHOOL:
        currentItem = item.value[0];
        break;
      case MEMBER.OCCUPATION:
        currentItem = item.value[0];
        break;
      case MEMBER.VEHICLE_NUMBER:
        currentItem = item.value[0];
        break;
      case MEMBER.MOBILE_PHONE:
        currentItem = item.value[0];
        break;
      case MEMBER.HOME_PHONE:
        currentItem = item.value[0];
        break;
      case MEMBER.ADDRESS:
        currentItem = item.value[0];
        break;

      default:
        currentItem = item.value[0];
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
