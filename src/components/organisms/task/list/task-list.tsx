import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTasks, setTasks } from '@/redux/reducers/task-filter-reducer';

import { TasksApi } from '@/api/tasks/tasks.api';
import TaskListView from '@/components/organisms/task/list/task-list.view';
import { DEFAULT_TASK, Task } from '@/models/task/task';
import { setTargetTask } from '@/redux/reducers/target-task-reducer';

type TaskListProps = {
  isMy?: boolean;
};

const TaskList = ({ isMy = false }: TaskListProps) => {
  const tasksApi = new TasksApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { tasks, taskFilter, taskOrderBy, taskOrderDirection } = useSelector(
    (state: RootState) => state.taskFilter
  );
  const { targetTask } = useSelector((state: RootState) => state.targetTask);

  const [prevReceiverIds, setReceiverIds] = useState<string[]>([]);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 상세정보 팝업 On/Off
  const [isTaskInformationShown, setIsTaskInformationShown] =
    useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadTasks = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchTasks({
          churchId,
          currentPage: page + 1,
          inChargeId: isMy ? user.member.id : undefined,
        })
      );
      if (fetchTasks.fulfilled.match(result)) {
        const newTasks: Task[] = result.payload;
        if (newTasks.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(tasks.map((task) => task.id));
          const filteredNewTasks = newTasks.filter(
            (task) => !existingIds.has(task.id)
          );
          dispatch(setTasks([...tasks, ...filteredNewTasks]));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
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
        const result = await dispatch(
          fetchTasks({
            churchId,
            currentPage: 1,
            inChargeId: isMy ? user.member.id : undefined,
          })
        );
        if (fetchTasks.fulfilled.match(result)) {
          dispatch(setTasks(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialTasks();
  }, [churchId, taskFilter, taskOrderBy, taskOrderDirection, isMy]);

  const onClickEditDone = async () => {
    try {
      // 1. 메인 심방 정보 수정
      await tasksApi.editTask(
        {
          churchId,
          taskId: targetTask.id,
        },
        {
          taskStatus: targetTask.taskStatus || undefined,
          inChargeId: targetTask.inChargeId || undefined,
          taskStartDate: targetTask.taskStartDate || undefined,
          taskEndDate: targetTask.taskEndDate || undefined,
          title: targetTask.title || undefined,
        }
      );

      if (targetTask?.receiverIds) {
        const addReceiverIds = targetTask.receiverIds?.filter(
          (id) => !prevReceiverIds.includes(id)
        );
        const deleteReceiverIds = prevReceiverIds.filter(
          (id) => !targetTask.receiverIds?.includes(id)
        );

        if (addReceiverIds.length > 0) {
          await tasksApi.addReceivers(
            { churchId, taskId: targetTask.id },
            { receiverIds: addReceiverIds }
          );
        }
        if (deleteReceiverIds.length > 0) {
          await tasksApi.deleteReceivers(
            { churchId, taskId: targetTask.id },
            { receiverIds: deleteReceiverIds }
          );
        }
      }

      await tasksApi
        .getTask({ churchId, taskId: targetTask.id })
        .then(async (response) => {
          const newTask: Task = response.data.data;

          const newTasks = tasks.map((v) => {
            return v.id !== newTask.id ? v : newTask;
          });

          dispatch(setTasks(newTasks));
          dispatch(setTargetTask(newTask));

          setIsEditShown(false);
          setTimeout(() => {
            setIsTaskInformationShown(true);
          }, 500);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 업무을 선택하여 상세 페이지로 이동
  const onClickTaskItem = async (taskId: string) => {
    try {
      const response = await tasksApi.getTask({
        churchId,
        taskId,
      });
      const task = response.data.data;

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

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await tasksApi.deleteTask({
        churchId,
        taskId: targetTask.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchTasks({
            churchId,
            currentPage: 1,
            inChargeId: isMy ? user.member.id : undefined,
          })
        );
        if (fetchTasks.fulfilled.match(result)) {
          dispatch(setTasks(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetTask(DEFAULT_TASK));
      setIsTaskInformationShown(false);
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditShown(false);
    setTimeout(() => {
      setIsTaskInformationShown(true);
    }, 500);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsTaskInformationShown(false);
    setTimeout(() => {
      setIsEditShown(true);
    }, 500);
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetTask]);

  const props = {
    list: {
      onClickTaskItem,
      loadTasks,
    },
    information: {
      isTaskInformationShown,
      isEditShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onClickEditDone,
      onClickEditOpen,
      onClickEditClose,
    },
  };

  return (
    <>
      <TaskListView {...props} />
    </>
  );
};

export default TaskList;
