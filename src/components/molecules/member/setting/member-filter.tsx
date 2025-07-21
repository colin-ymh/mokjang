import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { useI18n } from '../../../../../locales/client';
import MemberFilterView from '@/components/molecules/member/setting/member-filter.view';
import { setMemberFilter } from '@/redux/reducers/filter/member-filter-reducer';
import { getDateStringFromDate } from '@/utils/date';
import { useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';

type MemberFilterProps = {};

const MemberFilter = ({}: MemberFilterProps) => {
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();

  const [ageRange, setAgeRange] = useState<[number, number]>([1, 100]);

  const onChangeOfficerItems = (value: string[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        officer: value,
      })
    );
  };

  const onChangeMarriageItems = (value: string[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        marriage: value,
      })
    );
  };

  const onChangeBaptismItems = (value: string[]) => {
    dispatch(
      setMemberFilter({
        ...memberFilter,
        baptism: value,
      })
    );
  };

  const onChangeRegisterAfter = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);

      dispatch(
        setMemberFilter({
          ...memberFilter,
          registerAfter: newDate,
        })
      );
    }
  };

  const onChangeRegisterBefore = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);

      dispatch(
        setMemberFilter({
          ...memberFilter,
          registerBefore: newDate,
        })
      );
    }
  };

  const onChangeAgeRange = (values: [number, number]) => {
    setAgeRange(values);
  };

  useEffect(() => {
    if (ageRange[0] === 1 && ageRange[1] === 100) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthAfter: BLANK,
          birthBefore: BLANK,
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
        birthAfter: getDateStringFromDate(newBirthAfter),
        birthBefore: getDateStringFromDate(newBirthBefore),
      })
    );
  }, [ageRange]);

  const props = {
    ageRange,
    onChangeOfficerItems,
    onChangeMarriageItems,
    onChangeBaptismItems,
    onChangeRegisterAfter,
    onChangeRegisterBefore,
    onChangeAgeRange,
  };

  return (
    <>
      <MemberFilterView {...props} />
    </>
  );
};

export default MemberFilter;
