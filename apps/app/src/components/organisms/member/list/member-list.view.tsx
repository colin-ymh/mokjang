import styled from 'styled-components';

import MemberTable, {
  MemberTableProps,
} from '../../../molecules/member/list/member-table';
import MemberFilterRow from '../../../molecules/member/list/member-filter-row';
import { MEDIA_MIN_WIDTH, WHITE } from '@mokjang/constants';
import MemberItemList from '../../../molecules/member/list/member-item-list';
import SlidePopup from '../../../atoms/common/popup/slide-popup';
import MemberInformation from '../information/member-information';
import { CustomPopup, Loading } from '@mokjang/components';
import React, { useEffect } from 'react';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';
import EditMember from '../edit/edit-member';

const MemberListContainer = styled.div`
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
    padding: 0 20px;
  }
`;

const CancelContainer = styled.div`
  display: flex;
  margin-right: 10px;
`;

type MemberListViewProps = {
  list: MemberTableProps;
  information: {
    isMemberInformationShown: boolean;
    isLoading: boolean;
    isPopupShown: boolean;
    isEditShown: boolean;
    onClickEditOpen: () => void;
    onClickEditClose: () => void;
    onClickEditDone: () => void;
    onClickClose: () => void;
    onClickDelete: () => void;
    onClickConfirmOpen: () => void;
    onClickConfirmClose: () => void;
    onChangeProfileImage: (file: File | null) => void;
  };
};

const MemberListView = (props: MemberListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');
  const t_popup = useScopedI18n('popup');
  const {
    isMemberInformationShown,
    isLoading,
    isPopupShown,
    isEditShown,
    onClickClose,
    onClickDelete,
    onClickConfirmOpen,
    onClickConfirmClose,
    onClickEditOpen,
    onClickEditClose,
    onClickEditDone,
    onChangeProfileImage,
  } = props.information;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickClose();
      }
    };
    if (isMemberInformationShown) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMemberInformationShown, onClickClose]);

  return (
    <MemberListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      <MobileView>
        <MemberItemList {...props.list} />
      </MobileView>
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <MemberFilterRow />
        <MemberTable {...props.list} />
      </DesktopView>

      {/* 교인 상세정보 팝업*/}
      <SlidePopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
        onClickCancel={onClickConfirmOpen}
        headerTitle={t_title('memberInformation')}
        onClickDone={onClickEditOpen}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        headerHeight={65}
        disabledKeyboard={true}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteMemberTitle')}
            body={t_popup('deleteMemberBody')}
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
          {isMemberInformationShown && <MemberInformation />}
        </>
      </SlidePopup>
      <Loading isShow={isLoading} />

      {/* 교인 수정 팝업 */}
      <CustomPopup
        isShow={isEditShown}
        onClickClose={onClickEditClose}
        onClickCancel={onClickEditClose}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
        onClickDone={onClickEditDone}
        headerTitle={t_title('editMember')}
        width={700}
        height={700}
      >
        <EditMember onChangeProfileImage={onChangeProfileImage} />
      </CustomPopup>
    </MemberListContainer>
  );
};

export default MemberListView;
