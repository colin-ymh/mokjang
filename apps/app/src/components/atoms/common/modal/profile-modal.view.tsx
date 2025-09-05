import styled from 'styled-components';
import { CURSOR, GRAY, RED, WHITE } from '@mokjang/constants';
import { MainText, ProfileImage, SvgIcon } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getFormattedMobilePhone } from '@mokjang/utils';
import { Svg } from '@mokjang/assets';
import { useI18n, useScopedI18n } from '../../../../../locales/client';

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${WHITE};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  top: 40px;
  right: 0;
  padding: 30px 20px;
  gap: 20px;
  z-index: 10;

  width: 250px;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-right: 30px;
  cursor: pointer;
`;

const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 1px;
  background-color: ${GRAY.EXTRA_LIGHT};
`;

const SubscriptionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ButtonItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

export type ProfileModalViewProps = {
  onClickMy: () => void;
  onClickDonate: () => void;
  onClickSetting: () => void;
  onClickLogout: () => void;
};

const ProfileModalView = ({
  onClickMy,
  onClickDonate,
  onClickSetting,
  onClickLogout,
}: ProfileModalViewProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { subscription } = useSelector(
    (state: RootState) => state.subscription
  );
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_subscription = useScopedI18n('subscription');

  return (
    <>
      <ModalContainer>
        <ProfileItem>
          <ProfileImage
            value={user.churchUser[0]?.member?.profileImageUrl}
            width={40}
            height={40}
          />
          <ProfileDetail>
            <MainText fontWeight={600} fontSize={16}>
              {user.name}
            </MainText>
            <MainText fontWeight={400} fontSize={14} color={GRAY.DARK}>
              {getFormattedMobilePhone(user.mobilePhone)}
            </MainText>
          </ProfileDetail>
        </ProfileItem>
        <RowLine />
        {/*{subscription?.currentPlan && (*/}
        {/*  <>*/}
        {/*    <SubscriptionItem>*/}
        {/*      <MainText fontWeight={600} fontSize={14}>*/}
        {/*        {t('currentPlan')}*/}
        {/*      </MainText>*/}
        {/*      <MainText fontWeight={600} fontSize={14} color={MAIN.DEFAULT}>*/}
        {/*        {t_subscription(subscription.currentPlan)}*/}
        {/*      </MainText>*/}
        {/*    </SubscriptionItem>*/}
        {/*    <RowLine />*/}
        {/*  </>*/}
        {/*)}*/}
        <ButtonItem onClick={onClickMy}>
          <SvgIcon
            svg={Svg.Smile}
            size={18}
            color={GRAY.EXTRA_DARK}
            cursor={CURSOR.POINTER}
          />
          <MainText
            fontSize={16}
            fontWeight={400}
            color={GRAY.EXTRA_DARK}
            baselineOffsetPx={1}
            cursor={CURSOR.POINTER}
          >
            {t_button('myInformation')}
          </MainText>
        </ButtonItem>
        <ButtonItem onClick={onClickDonate}>
          <SvgIcon
            svg={Svg.Heart}
            size={18}
            color={GRAY.EXTRA_DARK}
            cursor={CURSOR.POINTER}
          />
          <MainText
            fontSize={16}
            fontWeight={400}
            color={GRAY.EXTRA_DARK}
            baselineOffsetPx={1}
            cursor={CURSOR.POINTER}
          >
            {t_button('donate')}
          </MainText>
        </ButtonItem>
        <ButtonItem onClick={onClickSetting}>
          <SvgIcon
            svg={Svg.Setting}
            size={18}
            color={GRAY.EXTRA_DARK}
            cursor={CURSOR.POINTER}
          />
          <MainText
            fontSize={16}
            fontWeight={400}
            color={GRAY.EXTRA_DARK}
            baselineOffsetPx={1}
            cursor={CURSOR.POINTER}
          >
            {t_button('setting')}
          </MainText>
        </ButtonItem>
        <RowLine />
        <ButtonItem onClick={onClickLogout}>
          <SvgIcon
            svg={Svg.Exit}
            size={18}
            color={RED.DEFAULT}
            cursor={CURSOR.POINTER}
          />
          <MainText
            fontSize={16}
            fontWeight={400}
            color={RED.DEFAULT}
            baselineOffsetPx={1}
            cursor={CURSOR.POINTER}
          >
            {t_button('logOut')}
          </MainText>
        </ButtonItem>
      </ModalContainer>
    </>
  );
};

export default ProfileModalView;
