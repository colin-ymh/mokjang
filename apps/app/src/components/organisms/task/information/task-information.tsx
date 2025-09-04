import React, { useState } from 'react';
import TaskInformationView from './task-information.view';
import { TASK_STATUS } from '@mokjang/constants';

type TaskInformationProps = {
  onChangeStatus: (status: TASK_STATUS) => void;
};

const TaskInformation = ({ onChangeStatus }: TaskInformationProps) => {
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

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
