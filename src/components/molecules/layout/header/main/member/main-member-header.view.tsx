import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useMainMemberHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { DIRECTION, SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Button from '@/components/atoms/common/button/button';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import GroupFilter from '@/components/atoms/layout/side/main-side/group-filter';
import AddMember from '@/components/organisms/member/add/add-member';

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
    height: 120px;
    padding: 0;
    justify-content: space-between;
    border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
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

const GroupFilterContainer = styled.div`
  display: flex;
  padding: 10px;
  width: 100%;
`;

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

type MainMemberHeaderViewProps = {
  isModalOpened: boolean;
  isRegisterShown: boolean;
  setIsRegisterShown: Dispatch<SetStateAction<boolean>>;
  onClickClose: () => void;
  onClickRegisterMemberButton: () => void;
  onClickHeaderBar: (id: string) => void;
  onClickDummyMembers: () => void;
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
  setIsRegisterShown,
  onClickClose,
  onClickRegisterMemberButton,
  onClickHeaderBar,
  onClickDummyMembers,
  onClickGroupButton,
  onDismissModal,
  selectedGroupName,
  onClickNewGroup,
  onChangeProfileImage,
  onClickSave,
}: MainMemberHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const headerBarItems = useMainMemberHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <DesktopTitle>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t_header(MAIN_HEADER_ID.MEMBER)}
          </MainText>
        </DesktopTitle>
        <MobileTitle>
          <GroupButton onClick={onClickGroupButton}>
            <MainText size={SIZE.EXTRA_LARGE}>{selectedGroupName}</MainText>
          </GroupButton>
        </MobileTitle>
        {/*<Button*/}
        {/*  text={'테스트용 교인 생성하기'}*/}
        {/*  width={200}*/}
        {/*  height={30}*/}
        {/*  onClick={onClickDummyMembers}*/}
        {/*  backgroundColor={BLACK}*/}
        {/*/>*/}
        <Button
          text={t_button('memberRegister')}
          onClick={onClickRegisterMemberButton}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      {/*<HeaderBottomContainer>*/}
      {/*<HeaderBar*/}
      {/*  value={contentId}*/}
      {/*  items={headerBarItems}*/}
      {/*  onClick={onClickHeaderBar}*/}
      {/*/>*/}
      {/*</HeaderBottomContainer>*/}
      {/* 팝업 */}
      {/* 그룹 필터링 팝업 */}
      <SlidePopup
        isShow={isModalOpened}
        direction={DIRECTION.BOTTOM}
        onClickClose={onDismissModal}
      >
        <GroupFilterContainer>
          <GroupFilter isDefaultOpen onChange={onClickNewGroup} />
        </GroupFilterContainer>
      </SlidePopup>
      {/* 데스크톱 교인 추가 */}
      <DesktopRegister>
        <SlidePopup
          isShow={isRegisterShown}
          onClickClose={onClickClose}
          onClickDone={onClickSave}
          headerTitle={t_title('memberRegister')}
        >
          <AddMember onChangeProfileImage={onChangeProfileImage} />
        </SlidePopup>
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
