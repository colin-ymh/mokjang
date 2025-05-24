import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  getDateFromString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@/utils/date';
import AddTaskView from '@/components/organisms/task/add/add-task.view';
import { setTargetTask } from '@/redux/reducers/target-task-reducer';
import { TASK_STATUS } from '@/constants/status/status';

type AddTaskProps = {};

const AddTask = ({}: AddTaskProps) => {
  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const dispatch = useDispatch<AppDispatch>();

  // ===== status =====
  const onChangeStatus = (status: TASK_STATUS) => {
    dispatch(setTargetTask({ ...targetTask, taskStatus: status }));
  };
  // ===== status =====

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
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetTask.taskStartDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetTask.taskStartDate)
        );
      }

      dispatch(
        setTargetTask({
          ...targetTask,
          taskStartDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetTask.taskStartDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetTask.taskStartDate)
      );
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        taskStartDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetTask.taskEndDate) {
        prevTime = getTimeStringFromDate(
          getDateFromString(targetTask.taskEndDate)
        );
      }

      dispatch(
        setTargetTask({
          ...targetTask,
          taskEndDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetTask.taskEndDate) {
      prevDate = getDateStringFromDate(
        getDateFromString(targetTask.taskEndDate)
      );
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        taskEndDate: `${prevDate}T${newTime}`,
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

  // ===== comment =====
  const [comment, setComment] = useState<string>(BLANK);

  const onChangeComment = (newComment: string) => {
    setComment(newComment);
  };

  useEffect(() => {
    dispatch(
      setTargetTask({
        ...targetTask,
        comment,
      })
    );
  }, [comment]);

  useEffect(() => {
    setComment(targetTask.comment);
  }, [targetTask.id]);
  // ===== comment =====

  // ===== receiver =====
  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetTask.reports) {
      const newReceivers = targetTask.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
        };
      });
      setReceivers(newReceivers);
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

  // ===== receiver =====

  const props = {
    inCharge,
    receivers,
    comment,
    onChangeStatus,
    onChangeTitle,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeInCharge,
    onChangeComment,
    onChangeReceivers,
  };

  return (
    <>
      <AddTaskView {...props} />
    </>
  );
};

export default AddTask;
