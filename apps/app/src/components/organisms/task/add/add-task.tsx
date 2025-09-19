import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getFormattedTitle,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import AddTaskView from './add-task.view';
import { setTargetTask } from '../../../../redux/reducers/target/target-task-reducer';

type AddTaskProps = {
  isEdit?: boolean;
};

const AddTask = ({ isEdit = false }: AddTaskProps) => {
  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const dispatch = useDispatch<AppDispatch>();

  // ===== title =====
  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetTask({
        ...targetTask,
        title: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== title =====

  // ===== period =====
  /* ── Period ── */
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
    const prevStartHm = targetTask.startDate
      ? getTimeStringFromDate(getDateFromDateString(targetTask.startDate))
      : '08:00';

    // 기본: 시작일 갱신
    let nextStart = combineDateTime(newStartYmd, prevStartHm);

    // 종료일 관련 교정
    if (targetTask.endDate) {
      const endDateObj = getDateFromDateString(targetTask.endDate);
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
        setTargetTask({
          ...targetTask,
          startDate: nextStart,
          endDate: combineDateTime(nextEndYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 날짜 변경 ── */
  const onChangeEndDate = (date: Date | null) => {
    if (!date) return;

    const newEndYmd = getDateStringFromDate(date);
    const prevEndHm = targetTask.endDate
      ? getTimeStringFromDate(getDateFromDateString(targetTask.endDate))
      : '08:00';

    let nextEnd = combineDateTime(newEndYmd, prevEndHm);

    if (targetTask.startDate) {
      const startDateObj = getDateFromDateString(targetTask.startDate);
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
        setTargetTask({
          ...targetTask,
          startDate: combineDateTime(nextStartYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        endDate: nextEnd,
      })
    );
  };

  /* ── 시작 시간 변경 ── */
  const onChangeStartTime = (value: number) => {
    const newStartHm = getHourFromMinute(value);
    const prevStartYmd = targetTask.startDate
      ? getDateStringFromDate(getDateFromDateString(targetTask.startDate))
      : '2000-01-01';

    // 기본: 시작 시간 갱신
    let nextStart = combineDateTime(prevStartYmd, newStartHm);

    if (targetTask.endDate) {
      const endDateObj = getDateFromDateString(targetTask.endDate);
      const endYmd = getDateStringFromDate(endDateObj);
      const endHm = getTimeStringFromDate(endDateObj);

      // 같은 날이고, 시작 시간이 종료 시간보다 크면 종료 시간을 시작 시간에 맞춤
      const nextEndHm =
        prevStartYmd === endYmd && toMinutes(newStartHm) > toMinutes(endHm)
          ? newStartHm
          : endHm;

      dispatch(
        setTargetTask({
          ...targetTask,
          startDate: nextStart,
          endDate: combineDateTime(endYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 시간 변경 ── */
  const onChangeEndTime = (value: number) => {
    const newEndHm = getHourFromMinute(value);
    const prevEndYmd = targetTask.endDate
      ? getDateStringFromDate(getDateFromDateString(targetTask.endDate))
      : '2000-01-01';

    let nextEnd = combineDateTime(prevEndYmd, newEndHm);

    if (targetTask.startDate) {
      const startDateObj = getDateFromDateString(targetTask.startDate);
      const startYmd = getDateStringFromDate(startDateObj);
      const startHm = getTimeStringFromDate(startDateObj);

      // 같은 날이고, 종료 시간이 시작 시간보다 작으면 시작 시간을 종료 시간에 맞춤
      const nextStartHm =
        startYmd === prevEndYmd && toMinutes(newEndHm) < toMinutes(startHm)
          ? newEndHm
          : startHm;

      dispatch(
        setTargetTask({
          ...targetTask,
          startDate: combineDateTime(startYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        endDate: nextEnd,
      })
    );
  };
  // ===== period =====

  // ===== inCharge =====
  // 담당자
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetTask.inChargeId) {
      const newInCharge = {
        value: targetTask.inCharge.id,
        title: targetTask.inCharge.name,
        officer: targetTask.inCharge.officer?.name || BLANK,
      };

      setInCharge([newInCharge]);
    } else {
      setInCharge([]);
    }
  }, [targetTask.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    const newInCharge = values[0];
    setInCharge(values);

    dispatch(
      setTargetTask({
        ...targetTask,
        inChargeId: newInCharge ? newInCharge.value : BLANK,
      })
    );
  };

  // ===== inCharge =====

  // ===== content =====
  const [content, setContent] = useState<string>(BLANK);

  const onChangeContent = (newContent: string, delta: any, source: string) => {
    if (source !== 'user') return; // 사용자가 입력한 경우만 dispatch

    setContent(newContent);
  };

  useEffect(() => {
    dispatch(
      setTargetTask({
        ...targetTask,
        content,
      })
    );
  }, [content]);

  useEffect(() => {
    setContent(targetTask.content);
  }, [targetTask.id]);
  // ===== content =====

  // ===== receiver =====
  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetTask.reports) {
      const newReceivers = targetTask.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
          officer: report.receiver.officer?.name || BLANK,
        };
      });
      setReceivers(newReceivers);

      const receiverIds = targetTask.reports.map((report) => {
        return report.receiver.id;
      });

      dispatch(setTargetTask({ ...targetTask, receiverIds: receiverIds }));
    } else {
      setReceivers([]);
    }
  }, [targetTask.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);

    const receiverIds = values.map((value) => {
      return value.value;
    });

    dispatch(setTargetTask({ ...targetTask, receiverIds: receiverIds }));
  };

  const onClickDeleteReceiver = (receiverId: string) => {
    const newReceivers = receivers.filter((r) => r.value !== receiverId);
    setReceivers(newReceivers);
    dispatch(
      setTargetTask({
        ...targetTask,
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
      <AddTaskView {...props} />
    </>
  );
};

export default AddTask;
