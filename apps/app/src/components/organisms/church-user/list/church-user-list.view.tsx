import styled from 'styled-components';
import { Loading, MainText } from '@mokjang/components';
import React from 'react';
import { BLACK, GRAY, MEDIA_MIN_WIDTH } from '@mokjang/constants';
import ChurchUserTable, {
  UserTableProps,
} from '../../../molecules/church-user/list/church-user-table';
import ChurchUserRow, {
  ChurchUserRowProps,
} from '../../../molecules/church-user/list/church-user-row';
import SlidePopup from '../../../atoms/common/popup/slide-popup';

import { Svg } from '@mokjang/assets';
import { useScopedI18n } from '../../../../../locales/client';
import ChurchUserInformation from '../information/church-user-information';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import { getFormattedMobilePhone } from '@mokjang/utils';

const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
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
  gap: 20px;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  padding-right: 20px;
`;

const Cancel = styled(Svg.Cancel)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

export type UserListViewProps = {
  row: ChurchUserRowProps;
  list: UserTableProps;
  information: {
    isManager: boolean;
    isLoading: boolean;
    isChurchUserInformationShown: boolean;
    onClickCloseInformation: () => void;
    onClickDelete: () => void;
  };
};

const ChurchUserListView = (props: UserListViewProps) => {
  const {
    isManager,
    isLoading,
    isChurchUserInformationShown,
    onClickCloseInformation,
    onClickDelete,
  } = props.information;

  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');

  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  return (
    <UserListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <UserItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <ChurchUserRow {...props.row} />
        <TableContainer>
          <ChurchUserTable {...props.list} />
        </TableContainer>
      </DesktopView>
      {/* 회원 상세정보 팝업*/}
      <SlidePopup
        isShow={isChurchUserInformationShown}
        headerLeft={
          <ProfileContainer>
            <ProfileImage
              value={targetChurchUser.member.profileImageUrl}
              width={60}
              height={60}
            />
            <TextContainer>
              <MainText fontWeight={700} fontSize={20}>
                {targetChurchUser.user.name}
              </MainText>
              <MainText fontWeight={400} fontSize={14} color={GRAY.DARK}>
                {getFormattedMobilePhone(targetChurchUser.user.mobilePhone)}
              </MainText>
            </TextContainer>
          </ProfileContainer>
        }
        headerHeight={150}
        onClickClose={onClickCloseInformation}
        onClickCancel={onClickCloseInformation}
        cancelText={t_button('close')}
      >
        <ChurchUserInformation
          isManager={isManager}
          onClickDelete={onClickDelete}
        />
      </SlidePopup>
      <Loading isShow={isLoading} />
    </UserListContainer>
  );
};

export default ChurchUserListView;
