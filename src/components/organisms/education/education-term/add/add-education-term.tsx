import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import {
  getDateFromString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@/utils/date';
import { setTargetEducationTerm } from '@/redux/reducers/target/target-education-term-reducer';
import AddEducationTermView from '@/components/organisms/education/education-term/add/add-education-term.view';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

import { EDUCATION_TERM_STATUS } from '@/constants/status/status';

type AddEducationTermProps = {};

const AddEducationTerm = ({}: AddEducationTermProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== status =====
  const onChangeStatus = (status: EDUCATION_TERM_STATUS) => {
    dispatch(
      setTargetEducationTerm({ ...targetEducationTerm, status: status })
    );
  };
  // ===== status =====

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
  /* ── Period ── */
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationTerm.startDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetEducationTerm.startDate)
        );
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationTerm.startDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetEducationTerm.startDate)
      );
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        startDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationTerm.endDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetEducationTerm.endDate)
        );
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          endDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationTerm.endDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetEducationTerm.endDate)
      );
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        endDate: `${prevDate}T${newTime}`,
      })
    );
  };
  // ===== period =====

  // ===== inCharge =====
  // 담당자
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationTerm.inChargeId) {
      const newInCharge = {
        value: targetEducationTerm.inCharge.id,
        title: targetEducationTerm.inCharge.name,
      };

      setInCharge([newInCharge]);
    } else {
      setInCharge([]);
    }
  }, [targetEducationTerm.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    const newInCharge = values[0];
    setInCharge(values);

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        inChargeId: newInCharge ? newInCharge.value : BLANK,
      })
    );
  };

  // ===== inCharge =====

  // ===== content =====
  const [content, setContent] = useState<string>(BLANK);

  const onChangeContent = (newContent: string) => {
    setContent(newContent);
  };

  useEffect(() => {
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        content,
      })
    );
  }, [content]);

  useEffect(() => {
    setContent(targetEducationTerm.content);
  }, [targetEducationTerm.id]);
  // ===== content =====

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
          status: EDUCATION_ENROLLMENT_STATUS.INCOMPLETE,
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

  // 수강 교인 상태 변경
  const onChangeEnrollmentStatus = (
    value: EDUCATION_ENROLLMENT_STATUS,
    targetEnrollment: EducationEnrollment
  ) => {
    const newEnrollments = targetEducationTerm.educationEnrollments.map(
      (enrollment) => {
        if (enrollment.memberId === targetEnrollment.memberId) {
          return { ...enrollment, status: value };
        } else {
          return enrollment;
        }
      }
    );

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        educationEnrollments: newEnrollments,
      })
    );
  };
  // ===== 수강 교인 =====

  const props = {
    content,
    inCharge,
    onChangeStatus,
    onChangeTerm,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeInCharge,
    onChangeContent,
    onClickNewEnrollment,
    onChangeEnrollmentStatus,
  };

  return (
    <>
      <AddEducationTermView {...props} />
    </>
  );
};

export default AddEducationTerm;
