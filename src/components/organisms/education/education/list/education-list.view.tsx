import styled from 'styled-components';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { MAIN, WHITE } from '@/constants/styles/color';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import EducationTable, {
  EducationTableProps,
} from '@/components/molecules/education/education/education-table';
import EducationRow from '@/components/molecules/education/education/education-row';
import AddEducation from '@/components/organisms/education/education/add/add-education';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import WrappedPagePopup from '@/components/atoms/common/popup/wrapped-page-popup';
import { useScopedI18n } from '../../../../../../locales/client';

const EducationListContainer = styled.div`
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

type EducationListViewProps = {
  list: EducationTableProps;
  information: {
    isSaveEnabled: boolean;
    isEducationInformationShown: boolean;
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

const EducationListView = (props: EducationListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const t_title = useScopedI18n('title');
  const {
    isSaveEnabled,
    isEducationInformationShown,
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

  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  return (
    <>
      <EducationListContainer>
        {/* 모바일에서 보일 목록형 UI */}
        {/*<MobileView>*/}
        {/*  <EducationItemList {...props.list} />*/}
        {/*</MobileView>*/}
        {/* 데스크탑에서 보일 테이블형 UI */}
        <DesktopView>
          <EducationRow />
          <EducationTable {...props.list} />
        </DesktopView>
      </EducationListContainer>

      {/* 업무 상세정보 팝업*/}
      <WrappedPagePopup
        isShow={isEducationInformationShown}
        onClickClose={onClickClose}
        headerTitle={targetEducation?.name}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={onClickEditOpen}
        onClickCancel={onClickConfirmOpen}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteEducationTitle')}
            body={t_popup('deleteEducationBody')}
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
          {/*<EducationInformation />*/}
        </>
      </WrappedPagePopup>

      {/* 심방 수정 팝업*/}
      <WrappedPagePopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        onClickDone={onClickEditDone}
        headerTitle={t_title('editEducation')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddEducation />
      </WrappedPagePopup>
      <Loading isShow={isLoading} />
    </>
  );
};

export default EducationListView;
