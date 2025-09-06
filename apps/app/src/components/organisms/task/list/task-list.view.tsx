import styled from 'styled-components';
import { Loading } from '@mokjang/components';
import React from 'react';
import { MAIN, MEDIA_MIN_WIDTH, TASK_STATUS, WHITE } from '@mokjang/constants';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import TaskTable, { TaskTableProps } from '../../../molecules/task/task-table';
import TaskRow from '../../../molecules/task/task-row';
import AddTask from '../add/add-task';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import TaskInformation from '../information/task-information';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: ${WHITE};
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

type TaskListViewProps = {
  list: TaskTableProps;
  information: {
    isSaveEnabled: boolean;
    isTaskInformationShown: boolean;
    isEditShown: boolean;
    isLoading: boolean;
    isPopupShown: boolean;
    onClickClose: () => void;
    onClickDelete: () => void;
    onClickConfirmOpen: () => void;
    onClickConfirmClose: () => void;
    onClickEditDone: () => void;
    onClickEditOpen: () => void;
    onClickEditClose: () => void;
    onChangeStatus: (status: TASK_STATUS) => void;
  };
};

const TaskListView = (props: TaskListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const {
    isSaveEnabled,
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
    onChangeStatus,
  } = props.information;

  const { targetTask } = useSelector((state: RootState) => state.targetTask);

  return (
    <>
      <TaskListContainer>
        {/* 모바일에서 보일 목록형 UI */}
        {/*<MobileView>*/}
        {/*  <TaskItemList {...props.list} />*/}
        {/*</MobileView>*/}
        {/* 데스크탑에서 보일 테이블형 UI */}
        <DesktopView>
          <TaskRow />
          <TaskTable {...props.list} />
        </DesktopView>
      </TaskListContainer>

      {/* 업무 상세정보 팝업*/}
      <ScrollSlidePopup
        isShow={isTaskInformationShown}
        headerTitle={targetTask?.title}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickClose={onClickClose}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
        status={targetTask?.status}
        onChangeStatus={onChangeStatus}
        stageTwoTop={150}
        inCharge={targetTask?.inCharge}
        startDate={targetTask?.startDate}
        endDate={targetTask?.endDate}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteTaskTitle')}
            body={t_popup('deleteTaskBody')}
            buttonNum={2}
            isShow={isPopupShown}
            onClickLeftButton={onClickConfirmClose}
            onClickRightButton={() => {
              onClickDelete();
              onClickConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <TaskInformation onChangeStatus={onChangeStatus} />

          {/* 심방 수정 팝업*/}
          <ScrollSlidePopup
            isShow={isEditShown}
            onClickClose={onClickEditClose}
            onClickCancel={onClickEditClose}
            onClickDone={onClickEditDone}
            headerTitle={t_title('editTask')}
            doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
            doneDisabled={!isSaveEnabled}
            isAnimation={false}
          >
            <AddTask isEdit={true} />
          </ScrollSlidePopup>
        </>
      </ScrollSlidePopup>
      <Loading isShow={isLoading} />
    </>
  );
};

export default TaskListView;
