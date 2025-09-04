import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';

import { useI18n } from '../../../../../locales/client';
import MemberFilterView from './member-filter.view';
import { setMemberFilter } from '../../../../redux/reducers/filter/member-filter-reducer';
import { getDateStringFromDate } from '@mokjang/utils';
import { useEffect, useState } from 'react';
import { BAPTISM, BLANK, MARRIAGE } from '@mokjang/constants';

type MemberFilterProps = {};

const MemberFilter = ({}: MemberFilterProps) => {
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();

  const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);

  const onChangeOfficerItems = (value: (string | null)[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        officerIds: value,
      })
    );
  };

  const onChangeMarriageItems = (value: (MARRIAGE | null)[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        marriageStatuses: value,
      })
    );
  };

  const onChangeBaptismItems = (value: BAPTISM[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        baptismStatuses: value,
      })
    );
  };

  const onChangeRegisteredFrom = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);

      dispatch(
        setMemberFilter({
          ...memberFilter,
          registeredFrom: newDate,
        })
      );
    }
  };

  const onChangeRegisteredTo = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);

      dispatch(
        setMemberFilter({
          ...memberFilter,
          registeredTo: newDate,
        })
      );
    }
  };

  const onChangeAgeRange = (values: [number, number]) => {
    setAgeRange(values);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (ageRange[0] === 1 && ageRange[1] === 100) {
        dispatch(
          setMemberFilter({
            ...memberFilter,
            birthFrom: BLANK,
            birthTo: BLANK,
          })
        );
        return;
      }

      const newBirthAfter = new Date();
      newBirthAfter.setFullYear(newBirthAfter.getFullYear() - ageRange[1]);

      const newBirthBefore = new Date();
      newBirthBefore.setFullYear(newBirthBefore.getFullYear() - ageRange[0]);

      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthFrom: getDateStringFromDate(newBirthAfter),
          birthTo: getDateStringFromDate(newBirthBefore),
        })
      );
    }, 300); // 300ms 딜레이

    return () => {
      clearTimeout(handler);
    };
  }, [ageRange, dispatch, memberFilter]);

  const props = {
    ageRange,
    onChangeOfficerItems,
    onChangeMarriageItems,
    onChangeBaptismItems,
    onChangeRegisteredFrom,
    onChangeRegisteredTo,
    onChangeAgeRange,
  };

  return (
    <>
      <MemberFilterView {...props} />
    </>
  );
};

export default MemberFilter;
