import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useMainMemberHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { DIRECTION, SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../locales/client';
import AddUser from '../../../../../../public/svg/user-plus.svg';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import GroupFilter from '@/components/atoms/layout/side/main-side/group-filter';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MemberRegister from '@/components/organisms/register/member-register';

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
    height: auto;
    padding: 20px 20px 0 20px;
    border-bottom: 1px solid ${GRAY.LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
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

const HeaderBottomContainer = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  gap: 10px;
  flex-direction: row;
`;

const AddButton = styled(AddUser)`
  width: 25px;
  height: 25px;
  cursor: pointer;
  pointer-events: auto;

  &:hover {
    background-color: ${GRAY.LIGHT};
    border-radius: 5px;
  }
`;

const GroupFilterContainer = styled.div`
  display: flex;
  padding: 10px;
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
}: MainMemberHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const headerBarItems = useMainMemberHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <DesktopTitle>
          <MainText size={SIZE.EXTRA_LARGE}>{t_header('member')}</MainText>
        </DesktopTitle>
        <MobileTitle>
          <GroupButton onClick={onClickGroupButton}>
            <MainText size={SIZE.EXTRA_LARGE}>{selectedGroupName}</MainText>
          </GroupButton>
        </MobileTitle>
        <ButtonContainer>
          {/*<Button*/}
          {/*  text={'테스트용 교인 생성하기'}*/}
          {/*  width={200}*/}
          {/*  height={30}*/}
          {/*  onClick={onClickDummyMembers}*/}
          {/*  backgroundColor={BLACK}*/}
          {/*/>*/}
          <AddButton onClick={onClickRegisterMemberButton} />
          {/*<GroupButton onClick={onClickGroupButton} />*/}
        </ButtonContainer>
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
      {/* 팝업 */}
      {/* 그룹 필터링 팝업 */}
      <SlidePopup
        isShow={isModalOpened}
        direction={DIRECTION.BOTTOM}
        onClickClose={onDismissModal}
      >
        <GroupFilterContainer>
          <GroupFilter isDefaultOpen onClick={onClickNewGroup} />
        </GroupFilterContainer>
      </SlidePopup>
      {/* 데스크톱 교인 추가 */}
      <DesktopRegister>
        <CustomPopup
          isShow={isRegisterShown}
          onClickClose={onClickClose}
          width={30}
          height={80}
          isPercentage={true}
        >
          <MemberRegister setIsShown={setIsRegisterShown} />
        </CustomPopup>
      </DesktopRegister>
      {/* 모바일 교인 추가*/}
      <MobileRegister>
        <SlidePopup isShow={isRegisterShown} onClickClose={onClickClose}>
          <MemberRegister setIsShown={setIsRegisterShown} />
        </SlidePopup>
      </MobileRegister>
    </HeaderContainer>
  );
};

export default MainMemberHeaderView;
