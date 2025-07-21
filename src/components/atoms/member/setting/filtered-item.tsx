import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { MEMBER } from '@/constants/column/member-column';
import { BAPTISM, BLANK, GENDER, MARRIAGE } from '@/constants/constant';

import { useI18n } from '../../../../../locales/client';
import { setMemberFilter } from '@/redux/reducers/filter/member-filter-reducer';
import { getGroup } from '@/utils/group';
import FilteredItemView, {
  FilteredItemType,
} from '@/components/atoms/member/setting/filtered-item.view';
import { getAge, getDateFromDateString } from '@/utils/date';
import { getTranslatedAge } from '@/utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

type FilteredItemProps = {
  item: FilteredItemType;
};

const FilteredItem = ({ item }: FilteredItemProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const { educations } = useSelector(
    (state: RootState) => state.educationFilter
  );
  const { groups, officers, ministries } = useSelector(
    (state: RootState) => state.church
  );
  const dispatch = useDispatch<AppDispatch>();
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );

  // 해당 필터 내용 삭제
  const onClickCancel = () => {
    if (item.title === MEMBER.AGE) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthAfter: BLANK,
          birthBefore: BLANK,
        })
      );
    } else if (item.title === MEMBER.REGISTERED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          registerAfter: BLANK,
          registerBefore: BLANK,
        })
      );
    } else if (item.title === MEMBER.UPDATED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          updateAfter: BLANK,
          updateBefore: BLANK,
        })
      );
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
          .map((groupId) => getGroup(groupId, groups)?.name)
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
      case MEMBER.BAPTISM:
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((baptismId) => t(baptismId as BAPTISM))
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
      case MEMBER.AGE:
        currentItem = item.value
          .map((date) =>
            getTranslatedAge(locale, getAge(getDateFromDateString(date)))
          )
          .reverse()
          .filter(Boolean)
          .join(' ~ ');
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

  const props = {
    valueText,
    onClickCancel,
    item,
  };

  return (
    <>
      <FilteredItemView {...props} />
    </>
  );
};

export default FilteredItem;
