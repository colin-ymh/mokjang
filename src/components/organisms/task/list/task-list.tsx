import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchTasks,
  setTaskPage,
} from '@/redux/reducers/filter/task-filter-reducer';

import TaskListView from '@/components/organisms/task/list/task-list.view';
import { DEFAULT_TASK } from '@/models/task/task';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { TasksApi } from '@/api/tasks/tasks.api';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK, HEADER_BAR } from '@/constants/constant';

type TaskListProps = {
  headerType?: HEADER_BAR;
};

const TaskList = ({ headerType }: TaskListProps) => {
  const taskApi = new TasksApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { tasks, taskPage, taskFilter, taskOrderBy, taskOrderDirection } =
    useSelector((state: RootState) => state.taskFilter);
  const { targetTask } = useSelector((state: RootState) => state.targetTask);

  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isTaskInformationShown, setIsTaskInformationShown] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadTasks = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setTaskPage(taskPage + 1));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialTasks = async () => {
      try {
        await dispatch(setTaskPage(1));
        await dispatch(fetchTasks({ headerType }));
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialTasks();
  }, [taskFilter, taskOrderBy, taskOrderDirection, headerType]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickTaskItem = async (taskId: string) => {
    try {
      const response = await taskApi.getTask({ churchId, taskId });
      const task = response.data.data;

      dispatch(setTargetTask(task));
      dispatch(setTargetTask(task));
      setIsTaskInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsTaskInformationShown(false);
    dispatch(setTargetTask(DEFAULT_TASK));
  };

  // 업무 삭제하기
  const onClickDelete = async () => {
    try {
      await taskApi.deleteTask({
        churchId,
        taskId: targetTask.id,
      });

      // 초기화 후 다시 로드
      dispatch(setTaskPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchTasks({ headerType }));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetTask(DEFAULT_TASK));
      setIsTaskInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetTask(targetTask));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    const taskApi = new TasksApi(false);
    setIsEditShown(false);
    const response = await taskApi.getTask({
      churchId,
      taskId: targetTask.id,
    });
    const newTask = response.data.data;
    dispatch(setTargetTask(newTask));
  };

  const onClickEditDone = async () => {
    try {
      await taskApi
        .editTask(
          { churchId, taskId: targetTask.id },
          {
            status: targetTask.status || undefined,
            title: targetTask.title || undefined,
            inChargeId: targetTask.inChargeId || undefined,
            startDate: targetTask.startDate || undefined,
            endDate: targetTask.endDate || undefined,
            parentTaskId: targetTask.parentTaskId || undefined,
            receiverIds: targetTask.receiverIds || undefined,
            content: targetTask.content || undefined,
          }
        )
        .then((response) => {
          const newTask = response.data.data;
          dispatch(setTargetTask(newTask));
          dispatch(fetchTasks({ headerType }));
          setIsEditShown(false);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetTask]);

  useEffect(() => {
    dispatch(fetchTasks({ headerType }));
  }, [taskPage]);

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
    list: {
      tasks,
      onClickTaskItem,
      loadTasks,
    },
    information: {
      isSaveEnabled,
      isTaskInformationShown,
      isLoading,
      isPopupShown,
      isEditShown,
      onClickEditOpen,
      onClickEditClose,
      onClickEditDone,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
    },
  };

  return (
    <>
      <TaskListView {...props} />
    </>
  );
};

export default TaskList;
