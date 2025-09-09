import styled from 'styled-components';
import { Loading } from '@mokjang/components';
import React from 'react';
import { MAIN, MEDIA_MIN_WIDTH, TASK_STATUS, WHITE } from '@mokjang/constants';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import VisitationTable, {
  VisitationTableProps,
} from '../../../molecules/visitation/visitation-table';
import VisitationRow from '../../../molecules/visitation/visitation-row';
import AddVisitation from '../add/add-visitation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import VisitationInformation from '../information/visitation-information';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';

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
      <ScrollSlidePopup
        isShow={isVisitationInformationShown}
        headerTitle={targetVisitation?.title}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickClose={onClickClose}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
        status={targetVisitation?.status}
        onChangeStatus={onChangeStatus}
        stageTwoTop={150}
        inCharge={targetVisitation?.inCharge}
        startDate={targetVisitation?.startDate}
        endDate={targetVisitation?.endDate}
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

          {/* 심방 수정 팝업*/}
          <ScrollSlidePopup
            isShow={isEditShown}
            onClickClose={onClickEditClose}
            onClickCancel={onClickEditClose}
            onClickDone={onClickEditDone}
            headerTitle={t_title('editVisitation')}
            doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
            doneDisabled={!isSaveEnabled}
            isAnimation={false}
          >
            <AddVisitation isEdit={true} />
          </ScrollSlidePopup>
          <Loading isShow={isLoading} />
        </>
      </ScrollSlidePopup>
    </>
  );
};

export default VisitationListView;
