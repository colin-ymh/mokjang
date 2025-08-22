import styled from 'styled-components';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { MAIN, WHITE } from '@/constants/styles/color';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import VisitationTable, {
  VisitationTableProps,
} from '@/components/molecules/visitation/visitation-table';
import VisitationRow from '@/components/molecules/visitation/visitation-row';
import AddVisitation from '@/components/organisms/visitation/add/add-visitation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import VisitationInformation from '@/components/organisms/visitation/information/visitation-information';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import { TASK_STATUS } from '@/constants/status/status';

const VisitationListContainer = styled.div`
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

type VisitationListViewProps = {
  list: VisitationTableProps;
  information: {
    isSaveEnabled: boolean;
    isVisitationInformationShown: boolean;
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

const VisitationListView = (props: VisitationListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const {
    isSaveEnabled,
    isVisitationInformationShown,
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

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  return (
    <>
      <VisitationListContainer>
        {/* 모바일에서 보일 목록형 UI */}
        {/*<MobileView>*/}
        {/*  <VisitationItemList {...props.list} />*/}
        {/*</MobileView>*/}
        {/* 데스크탑에서 보일 테이블형 UI */}
        <DesktopView>
          <VisitationRow />
          <VisitationTable {...props.list} />
        </DesktopView>
      </VisitationListContainer>

      {/* 심방 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={isVisitationInformationShown}
        onClickClose={onClickClose}
        headerTitle={targetVisitation?.title}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
        stageThreeTop={250}
        stageTwoTop={40}
        inCharge={targetVisitation.inCharge}
        startDate={targetVisitation.startDate}
        endDate={targetVisitation.endDate}
        status={targetVisitation.status}
        onChangeStatus={onChangeStatus}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteVisitationTitle')}
            body={t_popup('deleteVisitationBody')}
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
          <VisitationInformation onChangeStatus={onChangeStatus} />
        </>
      </WrappedPagePopup>

      {/* 심방 수정 팝업*/}
      <WrappedPagePopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        onClickDone={onClickEditDone}
        headerTitle={t_title('editVisitation')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddVisitation />
      </WrappedPagePopup>
      <Loading isShow={isLoading} />
    </>
  );
};

export default VisitationListView;
