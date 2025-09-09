import { MainText, TransparentBackground } from '@mokjang/components';
import { getFormattedMobilePhone, routeLandingPage } from '@mokjang/utils';
import { AuthApi } from '@/api/auth/auth.api';
import ProfileModalView, { ProfileModalViewProps } from './profile-modal.view';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import { BLACK, GRAY } from '@mokjang/constants';
import ChurchUserInformation from '@/components/organisms/church-user/information/church-user-information';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Svg } from '@mokjang/assets';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useScopedI18n } from '../../../../../locales/client';
import { UserApi } from '@/api/user/user.api';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { ManagersApi } from '@/api/managers/managers.api';

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

type ProfileModalProps = {
  onClickClose: () => void;
};

const ProfileModal = ({ onClickClose }: ProfileModalProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { churchId } = useSelector((state: RootState) => state.church);
  const managersApi = new ManagersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const t_button = useScopedI18n('button');

  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  const [isMyOpened, setIsMyOpened] = useState(false);

  const onClickMy = async () => {
    try {
      const response = await managersApi.getManager({
        churchId,
        churchUserId: user.churchUser[0].id,
      });
      dispatch(setTargetChurchUser(response.data.data));
    } catch (e) {
      dispatch(setTargetChurchUser(user.churchUser[0]));
    } finally {
      setIsMyOpened(true);
    }
  };

  const onClickMyClose = () => {
    setIsMyOpened(false);
  };

  const onClickDonate = () => {
    routeLandingPage('/donate');
  };

  const onClickSetting = () => {
    routeLandingPage('/setting');
  };

  const onClickLogout = async () => {
    await authApi.getLogOut();
    routeLandingPage('/');
  };

  const onClickLeave = async () => {
    await userApi.leaveChurch();
    routeLandingPage('/');
  };

  const props = {
    onClickMy,
    onClickDonate,
    onClickSetting,
    onClickLogout,
  } as ProfileModalViewProps;

  return (
    <>
      <TransparentBackground
        isOpened={true}
        onClick={onClickClose}
        zIndex={9}
        blur={false}
      />
      <ProfileModalView {...props} />
      {/* 회원 상세정보 팝업*/}
      <SlidePopup
        isShow={isMyOpened}
        headerLeft={
          <ProfileContainer>
            <ProfileImage
              value={user.churchUser[0]?.member?.profileImageUrl}
              width={60}
              height={60}
            />
            <TextContainer>
              <MainText fontWeight={700} fontSize={20}>
                {user.name}
              </MainText>
              <MainText fontWeight={400} fontSize={14} color={GRAY.DARK}>
                {getFormattedMobilePhone(user.mobilePhone)}
              </MainText>
            </TextContainer>
          </ProfileContainer>
        }
        headerRight={
          <ButtonContainer onClick={onClickMyClose}>
            <Cancel />
          </ButtonContainer>
        }
        headerHeight={150}
        cancelText={t_button('close')}
        onClickClose={onClickMyClose}
      >
        <ChurchUserInformation
          isMy={true}
          isManager={true}
          onClickDelete={onClickLeave}
        />
      </SlidePopup>
    </>
  );
};

export default ProfileModal;
