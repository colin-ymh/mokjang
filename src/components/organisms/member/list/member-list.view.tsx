import styled from 'styled-components';

import MemberTable, {
  MemberTableProps,
} from '@/components/molecules/member/list/member-table';
import MemberFilterRow from '@/components/molecules/member/list/member-filter-row';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import MemberItemList from '@/components/molecules/member/list/member-item-list';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import MemberInformation from '@/components/organisms/member/information/member-information';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import TrashIcon from '../../../../../public/svg/trash.svg';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useScopedI18n } from '../../../../../locales/client';

const MemberListContainer = styled.div`
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

type MemberListViewProps = {
  list: MemberTableProps;
  information: {
    isMemberInformationShown: boolean;
    isLoading: boolean;
    isPopupShown: boolean;
    onClickClose: () => void;
    onClickDelete: () => void;
    onClickConfirmOpen: () => void;
    onClickConfirmClose: () => void;
  };
};

const MemberListView = (props: MemberListViewProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const {
    isMemberInformationShown,
    isLoading,
    isPopupShown,
    onClickClose,
    onClickDelete,
    onClickConfirmOpen,
    onClickConfirmClose,
  } = props.information;

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
        headerRight={
          <ButtonRow>
            <ButtonContainer onClick={onClickConfirmOpen}>
              <Trash />
            </ButtonContainer>
            <ButtonContainer onClick={onClickClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
        isFooterShown={false}
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
    </MemberListContainer>
  );
};

export default MemberListView;
