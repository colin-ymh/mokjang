import styled from 'styled-components';
import { CURSOR, GRAY, MAIN, RED, WHITE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../locales/client';
import { Button, MainText, SvgIcon } from '@mokjang/components';
import { Svg } from '@mokjang/assets';
import useWindowSize from '@/hooks/window/window';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import NotificationItem from '@/components/molecules/notification/notification-item';
import { MutableRefObject } from 'react';

const ModalContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: ${WHITE};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  top: 40px;
  right: 0;
  z-index: 10;

  width: 400px;
  height: ${({ height }) => height}px;
  transition: height 0.2s;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${GRAY.LIGHT};
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const NotificationCount = styled.div`
  display: flex;
  border-radius: 100%;
  background-color: ${RED.DEFAULT};
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: auto;
`;

const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${GRAY.LIGHT};
  height: 60px;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
`;

export type NotificationModalViewProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  isZoomIn: boolean;
  onClickClose: () => void;
  onClickReadAll: () => void;
  onClickUnread: () => void;
  onClickZoomIn: () => void;
  onClickZoomOut: () => void;
};

const NotificationModalView = ({
  scrollRef,
  isZoomIn,
  onClickClose,
  onClickReadAll,
  onClickUnread,
  onClickZoomIn,
  onClickZoomOut,
}: NotificationModalViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_notification = useScopedI18n('notification');

  const { notificationUnreadCount, notifications } = useSelector(
    (state: RootState) => state.notification
  );

  const { height } = useWindowSize();

  return (
    <>
      <ModalContainer height={isZoomIn ? height - 200 : 400}>
        <HeaderContainer>
          <RowContainer>
            <MainText fontSize={16} fontWeight={600}>
              {t_notification('recents')}
            </MainText>
            {notificationUnreadCount > 0 && (
              <NotificationCount>
                <MainText color={WHITE} fontSize={12} fontWeight={700}>
                  {notificationUnreadCount}
                </MainText>
              </NotificationCount>
            )}
          </RowContainer>
          <RowContainer>
            <Button
              text={t_button('readAll')}
              onClick={onClickReadAll}
              color={MAIN.DEFAULT}
              width={'auto'}
              backgroundColor={WHITE}
            />
            <SvgIcon
              svg={Svg.Cancel}
              color={GRAY.DEFAULT}
              size={16}
              onClick={onClickClose}
              cursor={CURSOR.POINTER}
            />
          </RowContainer>
        </HeaderContainer>
        <ContentContainer ref={scrollRef}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClickClose={onClickClose}
            />
          ))}
        </ContentContainer>
        <FooterContainer>
          <Button
            text={t_notification('unread')}
            onClick={onClickUnread}
            color={GRAY.DARK}
            icon={<SvgIcon svg={Svg.Envelope} color={GRAY.DARK} />}
            width={'auto'}
            backgroundColor={WHITE}
          />

          {isZoomIn ? (
            <Button
              text={t_button('zoomOut')}
              onClick={onClickZoomOut}
              color={GRAY.DARK}
              icon={<SvgIcon svg={Svg.ZoomOut} color={GRAY.DARK} />}
              width={'auto'}
              backgroundColor={WHITE}
            />
          ) : (
            <Button
              text={t_button('zoomIn')}
              onClick={onClickZoomIn}
              color={GRAY.DARK}
              icon={<SvgIcon svg={Svg.ZoomIn} color={GRAY.DARK} />}
              width={'auto'}
              backgroundColor={WHITE}
            />
          )}
        </FooterContainer>
      </ModalContainer>
    </>
  );
};

export default NotificationModalView;
