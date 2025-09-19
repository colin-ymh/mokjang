import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { BAPTISM, BLANK, LOCALE, MARRIAGE, MEMBER } from '@mokjang/constants';

import { useI18n } from '../../../../../locales/client';
import { setMemberFilter } from '../../../../redux/reducers/filter/member-filter-reducer';
import { getGroup } from '../../../../utils/group';
import FilteredItemView, { FilteredItemType } from './filtered-item.view';
import { usePathname } from 'next/navigation';

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
    if (item.title === MEMBER.BIRTH) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthFrom: BLANK,
          birthTo: BLANK,
        })
      );
    } else if (item.title === MEMBER.REGISTERED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          registeredFrom: BLANK,
          registeredTo: BLANK,
        })
      );
    } else if (item.title === MEMBER.SEARCH) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          search: BLANK,
        })
      );
    } else if (item.title === MEMBER.GROUP) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          groupId: undefined,
        })
      );
    } else if (item.title === MEMBER.OFFICER) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          officerIds: [],
        })
      );
    } else if (item.title === MEMBER.MARRIAGE) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          marriageStatuses: [],
        })
      );
    } else if (item.title === MEMBER.BAPTISM) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          baptismStatuses: [],
        })
      );
    }
  };

  const [valueText, setValueText] = useState<string>(BLANK);

  useEffect(() => {
    let currentItem;

    switch (item.title) {
      case MEMBER.MARRIAGE:
        currentItem = item.value
          .map((marriage) => {
            return marriage !== 'null'
              ? t(marriage as MARRIAGE)
              : t(MARRIAGE.NONE);
          })
          .join(', ');
        break;
      case MEMBER.GROUP: {
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((groupId) => {
            return groupId ? getGroup(groupId, groups)?.name : t('none');
          })
          .filter(Boolean) // undefined/null 필터링
          .join(', ');

        break;
      }
      case MEMBER.OFFICER:
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((officerId) => {
            return officerId !== 'null'
              ? officers.find((officer) => officer.id === officerId)?.name
              : t('officerNone');
          })
          .filter(Boolean)
          .join(', ');
        break;
      case MEMBER.BAPTISM:
        // 여러 그룹 ID가 배열로 넘어온 경우
        currentItem = item.value
          .map((baptismId) =>
            baptismId !== 'none' ? t(baptismId as BAPTISM) : t('baptismNone')
          )
          .filter(Boolean) // undefined/null 필터링
          .join(', ');
        break;

      case MEMBER.REGISTERED_AT:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;

      case MEMBER.BIRTH:
        currentItem = item.value.filter(Boolean).join(' ~ ');
        break;

      case MEMBER.SEARCH:
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
