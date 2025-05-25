import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import { TasksApi } from '@/api/tasks/tasks.api';
import { setTasks } from '@/redux/reducers/filter/task-filter-reducer';
import TaskInformationView from '@/components/organisms/task/information/task-information.view';
import { TASK_STATUS } from '@/constants/status/status';

type TaskInformationProps = {};

const TaskInformation = ({}: TaskInformationProps) => {
  const { tasks } = useSelector((state: RootState) => state.taskFilter);
  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const tasksApi = new TasksApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // ===== status =====
  const onChangeStatus = (status: TASK_STATUS) => {
    try {
      tasksApi
        .editTask({ churchId, taskId: targetTask.id }, { status })
        .then((response) => {
          const newTask = response.data.data;

          dispatch(setTargetTask({ ...targetTask, status }));

          const newTasks = tasks.map((v) => {
            return v.id !== newTask.id ? v : { ...v, status };
          });

          dispatch(setTasks(newTasks));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  const props = {
    onChangeStatus,
  };

  return (
    <>
      <TaskInformationView {...props} />
    </>
  );
};

export default TaskInformation;
