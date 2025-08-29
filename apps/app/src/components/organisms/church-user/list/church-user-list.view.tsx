import styled from 'styled-components';
import Loading from '../../../atoms/common/etc/loading';
import React from 'react';
import { MEDIA_MIN_WIDTH } from '../../../../constants/constant';
import ChurchUserTable, {
  UserTableProps,
} from '../../../molecules/church-user/list/church-user-table';
import ChurchUserRow from '../../../molecules/church-user/list/church-user-row';
import SlidePopup from '../../../atoms/common/popup/slide-popup';
import KebabDropdown from '../../../atoms/common/dropdown/kebab-dropdown';
import ConfirmPopup from '../../../atoms/common/popup/error-popup';
import TrashIcon from '../../../../../public/svg/trash.svg';
import { BLACK, DESTRUCTIVE } from '../../../../constants/styles/color';
import CancelIcon from '../../../../../public/svg/cancel.svg';
import { useScopedI18n } from '../../../../../locales/client';
import ChurchUserInformation from '../information/church-user-information';

const UserListContainer = styled.div`
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

type UserListViewProps = {
  list: UserTableProps;
  information: {
    isManager: boolean;
    isLoading: boolean;
    isChurchUserInformationShown: boolean;
    isPopupShown: boolean;
    onClickCloseInformation: () => void;
    onClickConfirmOpen: () => void;
    onClickConfirmClose: () => void;
    onClickDelete: () => void;
  };
};

const ChurchUserListView = (props: UserListViewProps) => {
  const {
    isManager,
    isLoading,
    isChurchUserInformationShown,
    isPopupShown,
    onClickCloseInformation,
    onClickConfirmOpen,
    onClickConfirmClose,
    onClickDelete,
  } = props.information;

  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  return (
    <UserListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <UserItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <ChurchUserRow />
        <ChurchUserTable {...props.list} />
      </DesktopView>
      {/* 회원 상세정보 팝업*/}
      <SlidePopup
        isShow={isChurchUserInformationShown}
        onClickClose={onClickCloseInformation}
        isFooterShown={false}
        headerRight={
          <ButtonRow>
            <KebabDropdown
              items={[
                {
                  value: 'delete',
                  title: t_button('delete'),
                  onClick: onClickConfirmOpen,
                },
              ]}
              width={150}
            />
            <ButtonContainer onClick={onClickCloseInformation}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteChurchUserTitle')}
            body={t_popup('deleteChurchUserBody')}
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
          <ChurchUserInformation isManager={isManager} />
        </>
      </SlidePopup>
      <Loading isShow={isLoading} />
    </UserListContainer>
  );
};

export default ChurchUserListView;
