import styled from 'styled-components';

import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { BLACK, DESTRUCTIVE, MAIN } from '@/constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import TrashIcon from '../../../../../public/svg/trash.svg';
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
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';

const VisitationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
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

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Trash = styled(TrashIcon)`
  width: 25px;
  height: 25px;
  stroke: ${DESTRUCTIVE.LIGHT};
  stroke-width: 1px;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
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
  } = props.information;

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  return (
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
      {/* 심방 상세정보 팝업*/}
      <SlidePopup
        isShow={isVisitationInformationShown}
        onClickClose={onClickClose}
        isFooterShown={false}
        headerTitle={targetVisitation?.visitationTitle}
        headerRight={
          <ButtonRow>
            <KebabDropdown
              items={[
                {
                  value: 'delete',
                  title: t_button('delete'),
                  onClick: onClickConfirmOpen,
                },
                {
                  value: 'edit',
                  title: t_button('edit'),
                  onClick: onClickEditOpen,
                },
              ]}
              width={150}
            />
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
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
          <VisitationInformation />
        </>
      </SlidePopup>
      {/* 심방 수정 팝업*/}
      <SlidePopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickDone={onClickEditDone}
        doneText={t_button('edit')}
        headerTitle={t_title('editVisitation')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddVisitation />
      </SlidePopup>
      <Loading isShow={isLoading} />
    </VisitationListContainer>
  );
};

export default VisitationListView;
