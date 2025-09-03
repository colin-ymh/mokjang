import React from 'react';
import styled from 'styled-components';

import { GRAY, WHITE } from '../../../../../../constants/styles/color';
import { MainText } from '../../../../../atoms/common/text/main-text';
import { DIRECTION, SIZE } from '../../../../../../constants/styles/style';

import { useScopedI18n } from '../../../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '../../../../../../constants/constant';
import SlidePopup from '../../../../../atoms/common/popup/slide-popup';
import Button from '../../../../../atoms/common/button/button';
import { MAIN_HEADER_ID } from '../../../../../../constants/layout/header';
import GroupFilter from '../../../../member/setting/group-filter';
import AddMember from '../../../../../organisms/member/add/add-member';
import Plus from '../../../../../../../public/svg/plus.svg';
import {
  getIsWellFormedMobilePhone,
  getIsWellFormedName,
} from '../../../../../../utils/check';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import CustomPopup from '../../../../../atoms/common/popup/custom-popup';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 80px;
    padding: 0;
    justify-content: space-between;
    //border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
`;

const DesktopTitle = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

const MobileTitle = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const GroupButton = styled.div`
  display: flex;
  background-color: transparent;
`;

// const HeaderBottomContainer = styled.div`
//   display: none;
//
//   @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//     align-items: center;
//   }
// `;

const DesktopRegister = styled.div`
  display: none;
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
  }
`;

const MobileRegister = styled.div`
  display: flex;
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const PlusIcon = styled(Plus)`
  width: 18px;
  height: 18px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

type MainMemberHeaderViewProps = {
  isModalOpened: boolean;
  isRegisterShown: boolean;
  onClickClose: () => void;
  onClickRegisterMemberButton: () => void;
  onClickHeaderBar: (id: string) => void;
  onClickGroupButton: () => void;
  onDismissModal: () => void;
  selectedGroupName: string;
  onClickNewGroup: (groupId: string | null) => void;
  onChangeProfileImage: (image: File | null) => void;
  onClickSave: () => void;
};

const MainMemberHeaderView = ({
  isModalOpened,
  isRegisterShown,
  onClickClose,
  onClickRegisterMemberButton,
  onClickGroupButton,
  onDismissModal,
  selectedGroupName,
  onClickNewGroup,
  onChangeProfileImage,
  onClickSave,
}: MainMemberHeaderViewProps) => {
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');
  const t_description = useScopedI18n('description');
  const t_title = useScopedI18n('title');

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <DesktopTitle>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.MEMBER)}
          </MainText>
        </DesktopTitle>
        <MobileTitle>
          <GroupButton onClick={onClickGroupButton}>
            <MainText size={SIZE.EXTRA_LARGE}>{selectedGroupName}</MainText>
          </GroupButton>
        </MobileTitle>
        <Button
          text={t_button('addMember')}
          onClick={onClickRegisterMemberButton}
          width={100}
          height={30}
          icon={<PlusIcon />}
        />
      </HeaderTopContainer>
      {/* 그룹 필터링 팝업 */}
      <SlidePopup
        isShow={isModalOpened}
        direction={DIRECTION.BOTTOM}
        onClickClose={onDismissModal}
      >
        <GroupFilter isDefaultOpen onChange={onClickNewGroup} />
      </SlidePopup>
      {/* 데스크톱 교인 추가 */}
      <DesktopRegister>
        <CustomPopup
          width={60}
          height={80}
          isPercentage={true}
          isShow={isRegisterShown}
          onClickCancel={onClickClose}
          onClickDone={onClickSave}
          headerTitle={t_title('memberRegister')}
          headerDescription={t_description('memberRegisterHeader')}
          doneDisabled={
            !getIsWellFormedName(targetMember.name) ||
            !getIsWellFormedMobilePhone(targetMember.mobilePhone)
          }
        >
          <AddMember onChangeProfileImage={onChangeProfileImage} />
        </CustomPopup>
      </DesktopRegister>
      {/* 모바일 교인 추가*/}
      <MobileRegister>
        <SlidePopup isShow={isRegisterShown} onClickClose={onClickClose}>
          <AddMember onChangeProfileImage={onChangeProfileImage} />
        </SlidePopup>
      </MobileRegister>
    </HeaderContainer>
  );
};

export default MainMemberHeaderView;
