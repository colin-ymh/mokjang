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
import { setTargetEducationSession } from '@/redux/reducers/target-education-session-reducer';
import AddEducationSessionView from '@/components/organisms/education/education-session/add/add-education-session.view';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import { EducationAttendance } from '@/models/education/education';

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
        name: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== title =====

  // ===== period =====
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationSession.startDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetEducationSession.startDate)
        );
      }

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationSession.startDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetEducationSession.startDate)
      );
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        startDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationSession.endDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetEducationSession.endDate)
        );
      }

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          endDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationSession.endDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetEducationSession.endDate)
      );
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        endDate: `${prevDate}T${newTime}`,
      })
    );
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
  const onChangeAttendanceStatus = (
    value: boolean,
    targetAttendance: EducationAttendance
  ) => {
    const newAttendances = targetEducationSession.educationAttendances.map(
      (attendance) => {
        if (attendance.id === targetAttendance.id) {
          return { ...attendance, status: value };
        } else {
          return attendance;
        }
      }
    );

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        educationAttendances: newAttendances,
      })
    );
  };
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
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeInCharge,
    onChangeContent,
    onChangeReceivers,
    onChangeAttendanceStatus,
  };

  return (
    <>
      <AddEducationSessionView {...props} />
    </>
  );
};

export default AddEducationSession;
