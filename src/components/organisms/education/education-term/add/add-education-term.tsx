import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK, EDUCATION_STATUS } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getStringFromDateTime } from '@/utils/date';
import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';
import AddEducationTermView from '@/components/organisms/education/education-term/add/add-education-term.view';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';

type AddEducationTermProps = {};

const AddEducationTerm = ({}: AddEducationTermProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== term =====
  const onChangeTerm = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        term: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== term =====

  // ===== period =====
  const onChangeStartDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: getStringFromDateTime(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          endDate: getStringFromDateTime(date),
        })
      );
    }
  };
  // ===== period =====

  // ===== comment =====
  const [comment, setComment] = useState<string>(BLANK);

  const onChangeComment = (newComment: string) => {
    setComment(newComment);
  };

  useEffect(() => {
    // dispatch(
    //   setTargetEducationTerm({
    //     ...targetEducationTerm,
    //     comment,
    //   })
    // );
  }, [comment]);

  useEffect(() => {
    // setComment(targetEducationTerm.comment);
  }, [targetEducationTerm.id]);
  // ===== comment =====

  // ===== 수강 교인 =====
  const onClickNewEnrollment = (values: MemberDropdownValueType[]) => {
    const newEnrollment = values[0];

    if (
      newEnrollment.value &&
      targetEducationTerm.educationEnrollments.every(
        (enrollment) => enrollment.memberId !== newEnrollment.value
      )
    ) {
      const newEnrollments = [
        ...targetEducationTerm.educationEnrollments,
        {
          id: new Date().toString(),
          memberId: newEnrollment.value,
          educationTermId: targetEducationTerm.id,
          status: EDUCATION_STATUS.INCOMPLETE,
          note: BLANK,
          member: { ...DEFAULT_MEMBER, name: newEnrollment.title },
        },
      ];

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          educationEnrollments: newEnrollments,
        })
      );
    }
  };
  // ===== 수강 교인 =====

  const props = {
    comment,
    onChangeTerm,
    onChangeStartDate,
    onChangeEndDate,
    onChangeComment,
    onClickNewEnrollment,
  };

  return (
    <>
      <AddEducationTermView {...props} />
    </>
  );
};

export default AddEducationTerm;
