import styled from 'styled-components';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { MAIN, WHITE } from '@/constants/styles/color';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import TaskTable, {
  TaskTableProps,
} from '@/components/molecules/task/task-table';
import TaskRow from '@/components/molecules/task/task-row';
import AddTask from '@/components/organisms/task/add/add-task';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import TaskInformation from '@/components/organisms/task/information/task-information';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';

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
      <WrappedPagePopup
        isShow={isTaskInformationShown}
        onClickClose={onClickClose}
        headerTitle={targetTask?.title}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
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
          <TaskInformation />
        </>
      </WrappedPagePopup>

      {/* 심방 수정 팝업*/}
      <WrappedPagePopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        onClickDone={onClickEditDone}
        headerTitle={t_title('editTask')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddTask />
      </WrappedPagePopup>
      <Loading isShow={isLoading} />
    </>
  );
};

export default TaskListView;
