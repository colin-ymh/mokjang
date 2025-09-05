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
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetTask.startDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetTask.startDate)
        );
      }

      dispatch(
        setTargetTask({
          ...targetTask,
          startDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetTask.startDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetTask.startDate)
      );
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        startDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetTask.endDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetTask.endDate)
        );
      }

      dispatch(
        setTargetTask({
          ...targetTask,
          endDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetTask.endDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetTask.endDate)
      );
    }

    dispatch(
      setTargetTask({
        ...targetTask,
        endDate: `${prevDate}T${newTime}`,
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

  // ===== content =====
  const [content, setContent] = useState<string>(BLANK);

  const onChangeContent = (newContent: string) => {
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
