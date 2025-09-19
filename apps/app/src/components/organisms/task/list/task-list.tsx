import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchTasks,
  setTaskPage,
  setTasks,
} from '@/redux/reducers/filter/task-filter-reducer';

import TaskListView from './task-list.view';
import { DEFAULT_TASK, NOTIFICATION_DOMAIN, Task } from '@mokjang/models';
import { setTargetTask } from '@/redux/reducers/target/target-task-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { TasksApi } from '@/api/tasks/tasks.api';
import {
  getDateFromDateString,
  getFullStringFromDate,
  getIsWellFormedTitle,
} from '@mokjang/utils';
import {
  BLACK,
  BLANK,
  DESTRUCTIVE,
  HEADER_BAR,
  TASK_STATUS,
} from '@mokjang/constants';
import { closeModal } from '@/redux/reducers/modal-reducer';

type TaskListProps = {
  headerType?: HEADER_BAR;
};

const TaskList = ({ headerType }: TaskListProps) => {
  const tasksApi = new TasksApi(false);
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

  const modal = useSelector((state: RootState) => state.modal);

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
      const response = await tasksApi.getTask({ churchId, taskId });
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
      await tasksApi.deleteTask({
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
    const tasksApi = new TasksApi(false);
    setIsEditShown(false);
    const response = await tasksApi.getTask({
      churchId,
      taskId: targetTask.id,
    });
    const newTask = response.data.data;
    dispatch(setTargetTask(newTask));
    dispatch(closeModal());
  };

  const onClickEditDone = async () => {
    try {
      const prevResponse = await tasksApi.getTask({
        churchId,
        taskId: targetTask.id,
      });

      const prev: Task = prevResponse.data.data;

      await tasksApi
        .editTask(
          { churchId, taskId: targetTask.id },
          {
            status:
              targetTask.status !== prev.status ? targetTask.status : undefined,
            title:
              targetTask.title !== prev.title ? targetTask.title : undefined,
            inChargeId:
              targetTask.inChargeId !== prev.inChargeId
                ? targetTask.inChargeId
                : undefined,
            startDate:
              getFullStringFromDate(
                getDateFromDateString(targetTask.startDate)
              ) !== getFullStringFromDate(getDateFromDateString(prev.startDate))
                ? getFullStringFromDate(
                    getDateFromDateString(targetTask.startDate)
                  )
                : undefined,
            endDate:
              getFullStringFromDate(
                getDateFromDateString(targetTask.endDate)
              ) !== getFullStringFromDate(getDateFromDateString(prev.endDate))
                ? getFullStringFromDate(
                    getDateFromDateString(targetTask.endDate)
                  )
                : undefined,
            parentTaskId:
              targetTask.parentTaskId !== prev.parentTaskId
                ? targetTask.parentTaskId
                : undefined,
            content:
              targetTask.content !== prev.content
                ? targetTask.content
                : undefined,
          }
        )
        .then(async () => {
          const reports = prev?.reports;

          const receiverIds =
            reports?.map((report) => report.receiver.id) || [];

          const addReceiverIds = targetTask.receiverIds?.filter(
            (receiverId) => !receiverIds.includes(receiverId)
          );
          const deleteReceiverIds =
            receiverIds?.filter(
              (receiverId) => !targetTask.receiverIds?.includes(receiverId)
            ) || [];

          if (addReceiverIds?.length > 0) {
            await tasksApi.addReceivers(
              {
                churchId,
                taskId: targetTask.id,
              },
              { receiverIds: addReceiverIds }
            );
          }

          if (deleteReceiverIds?.length > 0) {
            await tasksApi.deleteReceivers(
              {
                churchId,
                taskId: targetTask.id,
              },
              { receiverIds: deleteReceiverIds }
            );
          }

          const response = await tasksApi.getTask({
            churchId,
            taskId: targetTask.id,
          });
          const newTask = response.data.data;

          dispatch(setTargetTask(newTask));
          dispatch(fetchTasks({ headerType }));
          setIsEditShown(false);
        });

      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

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

  useEffect(() => {
    if (!modal.open || modal.type !== NOTIFICATION_DOMAIN.TASK || !modal.id)
      return;

    (async () => {
      try {
        const res = await tasksApi.getTask({
          churchId,
          taskId: modal.id as string,
        });
        const task = res.data.data;

        // 상세에 필요한 데이터 저장 + 상세 패널 오픈
        dispatch(setTargetTask(task));
        setIsTaskInformationShown(true);

        // (선택) 한 번 열었으면 modal 상태 정리해서 중복 오픈 방지
        dispatch(closeModal());
      } catch (error) {
        dispatch(closeModal());
        if (error instanceof Error) {
          dispatch(setToastText(error.message));
          dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
          dispatch(setIsToastShown(true));
        } else {
          setThrownError(new Error(String(error)));
        }
      }
    })();
  }, [modal.open, modal.type, modal.id, churchId]);

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
      onChangeStatus,
    },
  };

  return (
    <>
      <TaskListView {...props} />
    </>
  );
};

export default TaskList;
