import { MainText, ProfileImage, TransparentBackground, } from '@mokjang/components';
import { getFormattedPhone, routeLandingPage } from '@mokjang/utils';
import { AuthApi } from '@/api/auth/auth.api';
import ProfileModalView, { ProfileModalViewProps } from './profile-modal.view';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import { GRAY } from '@mokjang/constants';
import ChurchUserInformation from '@/components/organisms/church-user/information/church-user-information';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useScopedI18n } from '../../../../../locales/client';
import { UserApi } from '@/api/user/user.api';
import { setTargetChurchUser } from '@/redux/reducers/target/target-church-user-reducer';
import { ManagersApi } from '@/api/managers/managers.api';
import { closeModal } from '@/redux/reducers/modal-reducer';
import { NOTIFICATION_DOMAIN } from '@mokjang/models';

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

type ProfileModalProps = {
  onClickClose: () => void;
};

const ProfileModal = ({ onClickClose }: ProfileModalProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { churchId } = useSelector((state: RootState) => state.church);
  const managersApi = new ManagersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const t_button = useScopedI18n('button');

  const modal = useSelector((state: RootState) => state.modal);

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
    dispatch(closeModal());
  };

  const onClickDonate = () => {
    window.open(
      'https://horn-skipjack-ebf.notion.site/2769d70a6ddf80c3a134c80922fa49a3',
      '_blank',
      'noopener,noreferrer'
    );
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

  useEffect(() => {
    if (!modal.open || modal.type !== NOTIFICATION_DOMAIN.PERMISSION) return;

    (async () => {
      onClickMy();
    })();
  }, [modal.open, modal.type]);

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
                {getFormattedPhone(user.mobilePhone)}
              </MainText>
            </TextContainer>
          </ProfileContainer>
        }
        headerHeight={150}
        cancelText={t_button('close')}
        onClickClose={onClickMyClose}
        onClickCancel={onClickClose}
      >
        {isMyOpened && (
          <ChurchUserInformation
            isMy={true}
            isManager={true}
            onClickDelete={onClickLeave}
          />
        )}
      </SlidePopup>
    </>
  );
};

export default ProfileModal;
