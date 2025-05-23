import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getStringFromDateTime } from '@/utils/date';
import { setTargetEducationSession } from '@/redux/reducers/target-education-session-reducer';
import AddEducationSessionView from '@/components/organisms/education/education-session/add/add-education-session.view';
import { EDUCATION_SESSION_STATUS } from '@/models/education/education';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

type AddEducationSessionProps = {};

const AddEducationSession = ({}: AddEducationSessionProps) => {
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== status =====
  const onChangeStatus = (status: EDUCATION_SESSION_STATUS) => {
    dispatch(
      setTargetEducationSession({ ...targetEducationSession, status: status })
    );
  };
  // ===== status =====

  // ===== title =====
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        title: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== title =====

  // ===== session =====
  const onChangeSession = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        session: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== session =====

  // ===== period =====
  const onChangeStartDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: getStringFromDateTime(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          endDate: getStringFromDateTime(date),
        })
      );
    }
  };
  // ===== period =====

  // ===== inCharge =====
  // 담당자
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationSession.inChargeId) {
      const newInCharge = {
        value: targetEducationSession.inCharge.id,
        title: targetEducationSession.inCharge.name,
      };

      setInCharge([newInCharge]);
    } else {
      setInCharge([]);
    }
  }, [targetEducationSession.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    const newInCharge = values[0];
    setInCharge(values);

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
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
      setTargetEducationSession({
        ...targetEducationSession,
        content,
      })
    );
  }, [content]);

  useEffect(() => {
    setContent(targetEducationSession.content);
  }, [targetEducationSession.id]);
  // ===== content =====

  // 출석 내용 변경
  // const onChangeEnrollmentStatus = (
  //   value: EDUCATION_STATUS,
  //   targetEnrollment: EducationEnrollment
  // ) => {
  //   const newEnrollments = targetEducationSession.educationEnrollments.map(
  //     (enrollment) => {
  //       if (enrollment.memberId === targetEnrollment.memberId) {
  //         return { ...enrollment, status: value };
  //       } else {
  //         return enrollment;
  //       }
  //     }
  //   );
  //
  //   dispatch(
  //     setTargetEducationSession({
  //       ...targetEducationSession,
  //       educationEnrollments: newEnrollments,
  //     })
  //   );
  // };
  // ===== 수강 교인 =====

  // ===== receiver =====
  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationSession.reports) {
      const newReceivers = targetEducationSession.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
        };
      });
      setReceivers(newReceivers);
    } else {
      setReceivers([]);
    }
  }, [targetEducationSession.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);

    const receiverIds = values.map((value) => {
      return value.value;
    });

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        receiverIds: receiverIds,
      })
    );
  };

  // ===== receiver =====

  const props = {
    content,
    inCharge,
    receivers,
    onChangeStatus,
    onChangeTitle,
    onChangeSession,
    onChangeStartDate,
    onChangeEndDate,
    onChangeInCharge,
    onChangeContent,
    onChangeReceivers,
  };

  return (
    <>
      <AddEducationSessionView {...props} />
    </>
  );
};

export default AddEducationSession;
