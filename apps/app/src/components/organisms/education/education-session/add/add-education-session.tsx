import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getFormattedTitle,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import AddEducationSessionView from './add-education-session.view';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';
import { setTargetEducationSession } from '@/redux/reducers/target/target-education-session-reducer';

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
  /* 날짜 문자열 + 시간 문자열 → ISO 비슷한 포맷 */
  const combineDateTime = (ymd: string, hm: string) => `${ymd}T${hm}`;

  /* HH:mm → 분 */
  const toMinutes = (hm: string) => {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  };

  /* ── 시작 날짜 변경 ── */
  const onChangeStartDate = (date: Date | null) => {
    if (!date) return;

    const newStartYmd = getDateStringFromDate(date);
    const prevStartHm = targetEducationSession.startDate
      ? getTimeStringFromDate(
          getDateFromDateString(targetEducationSession.startDate)
        )
      : '00:00';

    // 기본: 시작일 갱신
    let nextStart = combineDateTime(newStartYmd, prevStartHm);

    // 종료일 관련 교정
    if (targetEducationSession.endDate) {
      const endDateObj = getDateFromDateString(targetEducationSession.endDate);
      const prevEndYmd = getDateStringFromDate(endDateObj);
      const prevEndHm = getTimeStringFromDate(endDateObj);

      let nextEndYmd = prevEndYmd;
      let nextEndHm = prevEndHm;

      // 시작일이 종료일을 넘어가면 종료 "날짜"를 시작 날짜로 이동
      if (newStartYmd > prevEndYmd) {
        nextEndYmd = newStartYmd;
      }

      // 같은 날인데 시작 시간이 종료 시간보다 크면 종료 "시간"을 시작 시간으로 맞춤
      if (nextEndYmd === newStartYmd) {
        if (toMinutes(prevStartHm) > toMinutes(prevEndHm)) {
          nextEndHm = prevStartHm;
        }
      }

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: nextStart,
          endDate: combineDateTime(nextEndYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 날짜 변경 ── */
  const onChangeEndDate = (date: Date | null) => {
    if (!date) return;

    const newEndYmd = getDateStringFromDate(date);
    const prevEndHm = targetEducationSession.endDate
      ? getTimeStringFromDate(
          getDateFromDateString(targetEducationSession.endDate)
        )
      : '00:00';

    let nextEnd = combineDateTime(newEndYmd, prevEndHm);

    if (targetEducationSession.startDate) {
      const startDateObj = getDateFromDateString(
        targetEducationSession.startDate
      );
      const prevStartYmd = getDateStringFromDate(startDateObj);
      const prevStartHm = getTimeStringFromDate(startDateObj);

      let nextStartYmd = prevStartYmd;
      let nextStartHm = prevStartHm;

      // 종료일이 시작일보다 앞이면 시작 "날짜"를 종료 날짜로 이동
      if (newEndYmd < prevStartYmd) {
        nextStartYmd = newEndYmd;
      }

      // 같은 날인데 종료 시간이 시작 시간보다 작으면 시작 "시간"을 종료 시간으로 맞춤
      if (nextStartYmd === newEndYmd) {
        if (toMinutes(prevEndHm) < toMinutes(prevStartHm)) {
          nextStartHm = prevEndHm;
        }
      }

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: combineDateTime(nextStartYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        endDate: nextEnd,
      })
    );
  };

  /* ── 시작 시간 변경 ── */
  const onChangeStartTime = (value: number) => {
    const newStartHm = getHourFromMinute(value);
    const prevStartYmd = targetEducationSession.startDate
      ? getDateStringFromDate(
          getDateFromDateString(targetEducationSession.startDate)
        )
      : '2000-01-01';

    // 기본: 시작 시간 갱신
    let nextStart = combineDateTime(prevStartYmd, newStartHm);

    if (targetEducationSession.endDate) {
      const endDateObj = getDateFromDateString(targetEducationSession.endDate);
      const endYmd = getDateStringFromDate(endDateObj);
      const endHm = getTimeStringFromDate(endDateObj);

      // 같은 날이고, 시작 시간이 종료 시간보다 크면 종료 시간을 시작 시간에 맞춤
      const nextEndHm =
        prevStartYmd === endYmd && toMinutes(newStartHm) > toMinutes(endHm)
          ? newStartHm
          : endHm;

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: nextStart,
          endDate: combineDateTime(endYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 시간 변경 ── */
  const onChangeEndTime = (value: number) => {
    const newEndHm = getHourFromMinute(value);
    const prevEndYmd = targetEducationSession.endDate
      ? getDateStringFromDate(
          getDateFromDateString(targetEducationSession.endDate)
        )
      : '2000-01-01';

    let nextEnd = combineDateTime(prevEndYmd, newEndHm);

    if (targetEducationSession.startDate) {
      const startDateObj = getDateFromDateString(
        targetEducationSession.startDate
      );
      const startYmd = getDateStringFromDate(startDateObj);
      const startHm = getTimeStringFromDate(startDateObj);

      // 같은 날이고, 종료 시간이 시작 시간보다 작으면 시작 시간을 종료 시간에 맞춤
      const nextStartHm =
        startYmd === prevEndYmd && toMinutes(newEndHm) < toMinutes(startHm)
          ? newEndHm
          : startHm;

      dispatch(
        setTargetEducationSession({
          ...targetEducationSession,
          startDate: combineDateTime(startYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetEducationSession({
        ...targetEducationSession,
        endDate: nextEnd,
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
        officer: targetEducationSession.inCharge.officer?.name || BLANK,
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

  const onChangeContent = (newContent: string, delta: any, source: string) => {
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
          officer: report.receiver.officer?.name || BLANK,
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
