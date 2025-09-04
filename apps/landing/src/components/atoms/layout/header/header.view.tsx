'use client';

import styled from 'styled-components';

import {
  BLACK,
  CURSOR,
  GRAY,
  LOCALE,
  MAIN,
  MEDIA_MIN_WIDTH,
  ORANGE,
  SIZE,
  WHITE,
} from '@mokjang/constants';
import { Button, MainTag, MainText } from '@mokjang/components';
import { useScopedI18n } from '../../../../../locales/client';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  getDateFromDateString,
  getDateGap,
  getTranslatedRestTrialDate,
} from '@mokjang/utils';
import { CONTENT_ID, MAIN_CONTENT_ID } from '@/constants/constant';
import { PLAN } from '@mokjang/models';
import { Svg } from '@mokjang/assets';

const HeaderContainer = styled.div`
  display: none;

  // 데크스탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    flex-direction: row;
    padding: 0 30px;
    height: 65px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
    background-color: ${WHITE};
    flex-shrink: 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 30px;
`;

const MenuItem = styled.div<{ $isFocused: boolean }>`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  border-radius: 10px;
  transition: all 0.2s;

  transform-origin: center;
  will-change: transform;
  backface-visibility: hidden;
  transform: ${({ $isFocused }) => ($isFocused ? 'scale(1.1)' : 'scale(1.00)')}
    translateZ(0);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

export type HeaderViewProps = {
  focusedContent: MAIN_CONTENT_ID | undefined;
  onClickMenu: (
    id: MAIN_CONTENT_ID.FUNCTION | MAIN_CONTENT_ID.PRICE | MAIN_CONTENT_ID.FAQ
  ) => void;
  onClickLogin: () => void;
  onClickContact: () => void;
  onClickLogout: () => void;
  onClickLogo: () => void;
  onClickFreeTrial: () => void;
};

const HeaderView = ({
  focusedContent,
  onClickMenu,
  onClickLogin,
  onClickContact,
  onClickLogout,
  onClickLogo,
  onClickFreeTrial,
}: HeaderViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const content = pathname.split('/')[2] as CONTENT_ID;

  const { user } = useSelector((state: RootState) => state.user);
  const { currentSubscription } = useSelector(
    (state: RootState) => state.subscription
  );

  const t_button = useScopedI18n('button');

  const menuItems = Object.values(MAIN_CONTENT_ID);

  return (
    <HeaderContainer>
      <LogoContainer onClick={onClickLogo}>
        <MainText
          color={MAIN.DEFAULT}
          size={SIZE.EXTRA_LARGE}
          fontSize={24}
          fontWeight={800}
          cursor={CURSOR.POINTER}
        >
          {'TEBAH'}
        </MainText>
      </LogoContainer>
      <MenuContainer>
        {menuItems.map((item) => {
          const isFocused = focusedContent === item;
          return (
            <MenuItem
              key={item}
              $isFocused={isFocused}
              onClick={() =>
                item === MAIN_CONTENT_ID.CONTACT
                  ? onClickContact()
                  : onClickMenu(
                      item as
                        | MAIN_CONTENT_ID.FUNCTION
                        | MAIN_CONTENT_ID.PRICE
                        | MAIN_CONTENT_ID.FAQ
                    )
              }
            >
              <MainText
                cursor={CURSOR.POINTER}
                fontSize={16}
                color={isFocused ? MAIN.DEFAULT : BLACK}
              >
                {t_button(item)}
              </MainText>
            </MenuItem>
          );
        })}
      </MenuContainer>
      {content !== CONTENT_ID.LOGIN && (
        <ButtonContainer>
          {user?.id && currentSubscription?.currentPlan === PLAN.FREE_TRIAL ? (
            <MainTag
              svg={Svg.Clock}
              color={ORANGE.DARK}
              backgroundColor={ORANGE.EXTRA_LIGHT}
              title={getTranslatedRestTrialDate(
                locale,
                getDateGap(
                  new Date(),
                  getDateFromDateString(
                    currentSubscription.trialEndsAt as string
                  )
                )
              )}
              rowPadding={15}
              columnPadding={8}
            />
          ) : (
            <Button
              text={t_button('free')}
              fontSize={16}
              width={100}
              height={40}
              backgroundColor={WHITE}
              borderColor={MAIN.DEFAULT}
              color={MAIN.DEFAULT}
              onClick={onClickFreeTrial}
            />
          )}
          {user?.id ? (
            <Button
              text={t_button('logout')}
              fontSize={16}
              width={100}
              height={40}
              onClick={onClickLogout}
            />
          ) : (
            <Button
              text={t_button('login')}
              fontSize={16}
              width={100}
              height={40}
              onClick={onClickLogin}
            />
          )}
        </ButtonContainer>
      )}
    </HeaderContainer>
  );
};

export default HeaderView;
