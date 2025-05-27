import MainTaskHeaderView from '@/components/molecules/layout/header/main/task/main-task-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { TasksApi } from '@/api/tasks/tasks.api';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import { DEFAULT_TASK } from '@/models/task/task';
import { setTasks } from '@/redux/reducers/filter/task-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';

type MainTaskHeaderProps = {};

const MainTaskHeader = ({}: MainTaskHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const { tasks } = useSelector((state: RootState) => state.taskFilter);

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const tasksApi = new TasksApi(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isAddTaskOpened, setIsAddTaskOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/task/${id}`);
  };

  const onClickAddTask = () => {
    setIsAddTaskOpened(true);
    dispatch(setTargetTask({ ...DEFAULT_TASK, id: 'TEMP' }));
  };

  const onClickCloseModal = () => {
    setIsAddTaskOpened(false);
    dispatch(setTargetTask(DEFAULT_TASK));
  };

  const onClickSaveTask = async () => {
    try {
      await tasksApi
        .createTask(
          { churchId },
          {
            status: targetTask.status,
            inChargeId: targetTask.inChargeId,
            startDate: targetTask.startDate,
            endDate: targetTask.endDate,
            title: targetTask.title,
            content: targetTask.content,
            receiverIds: targetTask.receiverIds,
          }
        )
        .then((response) => {
          const tempTask = response.data.data;

          tasksApi
            .getTask({ churchId, taskId: tempTask.id })
            .then((response) => {
              const newTask = response.data.data;

              const newTasks = [...tasks, newTask];
              dispatch(setTasks(newTasks));
            });
        });
      setIsAddTaskOpened(false);
      dispatch(setTargetTask(DEFAULT_TASK));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetTask.title)) {
      setIsSaveEnabled(false);
      return;
    }
    if (targetTask.inChargeId === BLANK) {
      setIsSaveEnabled(false);
      return;
    }
    if (!targetTask.startDate || !targetTask.endDate) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetTask]);

  const props = {
    isSaveEnabled,
    isAddTaskOpened,
    onClickHeaderBar,
    onClickAddTask,
    onClickCloseModal,
    onClickSaveTask,
  };

  return (
    <>
      <MainTaskHeaderView {...props} />
    </>
  );
};
export default MainTaskHeader;
