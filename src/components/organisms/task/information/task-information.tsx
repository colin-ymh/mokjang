import React, { useState } from 'react';
import TaskInformationView from '@/components/organisms/task/information/task-information.view';
import { TASK_STATUS } from '@/constants/status/status';

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
