import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '../../../../../constants/constant';
import { getFormattedTitle } from '../../../../../utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';

import {
  getDateFromDateString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '../../../../../utils/date';
import { setTargetEducationSession } from '../../../../../redux/reducers/target/target-education-session-reducer';
import AddEducationSessionView from './add-education-session.view';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';

type AddEducationSessionProps = {
  isEdit?: boolean;
};

const AddEducationSession = ({ isEdit = false }: AddEducationSessionProps) => {
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== title =====
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        title: getFormattedTitle(event.target.value, 50),
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
          getDateFromDateString(targetEducationSession.startDate)
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
        getDateFromDateString(targetEducationSession.startDate)
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
          getDateFromDateString(targetEducationSession.endDate)
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
        getDateFromDateString(targetEducationSession.endDate)
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

  const onClickDeleteReceiver = (receiverId: string) => {
    const newReceivers = receivers.filter((r) => r.value !== receiverId);
    setReceivers(newReceivers);
    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        receiverIds: newReceivers.map((r) => r.value),
      })
    );
  };
  // ===== receiver =====

  const props = {
    isEdit,
    inCharge,
    receivers,
    content,
    onChangeTitle,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeInCharge,
    onChangeContent,
    onChangeReceivers,
    onClickDeleteReceiver,
  };

  return (
    <>
      <AddEducationSessionView {...props} />
    </>
  );
};

export default AddEducationSession;
