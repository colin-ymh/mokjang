import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import MemberFilterView from './member-filter.view';
import { setMemberFilter } from '@/redux/reducers/filter/member-filter-reducer';
import { getAge, getDateFromDateString, getDateStringFromDate, } from '@mokjang/utils';
import { useEffect, useState } from 'react';
import { BAPTISM, BLANK, MARRIAGE } from '@mokjang/constants';

type MemberFilterProps = {};

const MemberFilter = ({}: MemberFilterProps) => {
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const dispatch = useDispatch<AppDispatch>();

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
      newBirthAfter.setFullYear(newBirthAfter.getFullYear() - ageRange[1] + 1);
      newBirthAfter.setMonth(0);
      newBirthAfter.setDate(1);

      const newBirthBefore = new Date();
      newBirthBefore.setFullYear(
        newBirthBefore.getFullYear() - ageRange[0] + 1
      );
      newBirthBefore.setMonth(11);
      newBirthBefore.setDate(31);

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
  }, [ageRange]);

  useEffect(() => {
    setAgeRange([
      memberFilter.birthTo
        ? getAge(getDateFromDateString(memberFilter.birthTo))
        : 1,
      memberFilter.birthFrom
        ? getAge(getDateFromDateString(memberFilter.birthFrom))
        : 100,
    ]);
  }, [memberFilter.birthFrom, memberFilter.birthTo]);

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
