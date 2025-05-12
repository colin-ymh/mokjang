import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { TASK_STATUS } from '@/models/task/task';
import { setTargetTask } from '@/redux/reducers/target-task-reducer';
import { TasksApi } from '@/api/tasks/tasks.api';
import { setTasks } from '@/redux/reducers/task-filter-reducer';
import TaskInformationView from '@/components/organisms/task/information/task-information.view';

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
        .editTask({ churchId, taskId: targetTask.id }, { taskStatus: status })
        .then((response) => {
          const newTask = response.data;

          dispatch(setTargetTask({ ...targetTask, taskStatus: status }));

          const newTasks = tasks.map((v) => {
            return v.id !== newTask.id ? v : { ...v, taskStatus: status };
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
