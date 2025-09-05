import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { CURSOR, GRAY, MEDIA_MIN_WIDTH, RED, WHITE } from '@mokjang/constants';
import { SIDE_ID } from '../../../../constants/layout/header';

import { Svg } from '@mokjang/assets';
import { MainText, SvgIcon } from '@mokjang/components';
import { useParams } from 'next/navigation';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import ProfileModal from '@/components/atoms/common/modal/profile-modal';
import { Chevron } from '@/components/atoms/common/dropdown/dropdown-chevron';
import NotificationModal from '@/components/organisms/notification/notification-modal';

const TopContainer = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    padding: 0 30px;
    height: 65px;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
    background-color: ${WHITE};
  }
`;

const TopLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const TopRight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
`;

const NotificationWrapper = styled.div`
  display: flex;
  position: relative;
`;

const NotificationCount = styled.div`
  display: flex;
  position: absolute;
  border-radius: 100%;
  background-color: ${RED.DEFAULT};
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  right: -8px;
  top: -8px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  position: relative;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-right: 30px;
  cursor: pointer;
`;

export type TopViewProps = {
  isNotificationOpened: boolean;
  isProfileOpened: boolean;
  onClickButton: (id: SIDE_ID) => void;
  handleSideShow: () => void;
  onClickNotification: () => void;
  onClickNotificationClose: () => void;
  onClickProfile: () => void;
  onClickProfileClose: () => void;
};

const TopView = ({
  isNotificationOpened,
  isProfileOpened,
  onClickButton,
  handleSideShow,
  onClickNotification,
  onClickNotificationClose,
  onClickProfile,
  onClickProfileClose,
}: TopViewProps) => {
  const slug = useParams().slug as string[] | undefined;
  const sideId = slug?.[0] ?? null;
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <TopContainer>
      <TopLeft>
        <SvgIcon
          svg={Svg.Burger}
          onClick={handleSideShow}
          size={24}
          width={1.5}
          color={GRAY.DARK}
        />
      </TopLeft>
      <TopRight>
        {sideId !== SIDE_ID.MAIN && (
          <SvgIcon
            svg={Svg.Home}
            onClick={() => onClickButton(SIDE_ID.MAIN)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
        {sideId !== SIDE_ID.NOTIFICATION && (
          <NotificationWrapper>
            <SvgIcon
              svg={Svg.Bell}
              onClick={onClickNotification}
              size={22}
              width={1.5}
              color={GRAY.DARK}
            />
            <NotificationCount>
              <MainText color={WHITE} fontSize={12} fontWeight={700}>
                2
              </MainText>
            </NotificationCount>
            {isNotificationOpened && (
              <NotificationModal onClickClose={onClickNotificationClose} />
            )}
          </NotificationWrapper>
        )}
        {sideId !== SIDE_ID.MANAGEMENT && (
          <SvgIcon
            svg={Svg.Setting}
            onClick={() => onClickButton(SIDE_ID.MANAGEMENT)}
            size={22}
            width={1.5}
            color={GRAY.DARK}
          />
        )}
        {/*{sideId !== SIDE_ID.GUIDE && (*/}
        {/*  <SvgIcon*/}
        {/*    svg={Svg.Question}*/}
        {/*    onClick={() => onClickButton(SIDE_ID.GUIDE)}*/}
        {/*    size={22}*/}
        {/*    width={1.5}*/}
        {/*    color={GRAY.DARK}*/}
        {/*  />*/}
        {/*)}*/}
        <ProfileWrapper>
          <ProfileItem onClick={onClickProfile}>
            <ProfileImage
              value={user.churchUser[0]?.member?.profileImageUrl}
              onClick={onClickProfile}
            />
            <MainText cursor={CURSOR.POINTER} fontWeight={500}>
              {user.name}
            </MainText>
            <Chevron $isOpened={isProfileOpened} />
          </ProfileItem>
          {isProfileOpened && (
            <ProfileModal onClickClose={onClickProfileClose} />
          )}
        </ProfileWrapper>
      </TopRight>
    </TopContainer>
  );
};

export default TopView;
