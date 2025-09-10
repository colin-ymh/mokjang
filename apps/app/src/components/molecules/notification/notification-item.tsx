import { Notification, NOTIFICATION_DOMAIN } from '@mokjang/models';
import { useI18n } from '../../../../locales/client';
import { MainText } from '@mokjang/components';
import styled from 'styled-components';
import { CURSOR, GRAY, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import { getTranslatedTimeAgo } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { NotificationApi } from '@/api/notification/notification.api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

const ItemContainer = styled.div<{ $backgroundColor?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  flex-shrink: 0;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  position: relative;
  cursor: pointer;
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Dot = styled.div`
  display: flex;
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  top: 20px;
  right: 20px;
  background-color: ${MAIN.DEFAULT};
`;

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const t = useI18n();

  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );

  const notificationsApi = new NotificationApi();

  const onClickItem = async () => {};

  return (
    <>
      <ItemContainer
        onClick={onClickItem}
        $backgroundColor={notification.isRead ? WHITE : MAIN.EXTRA_LIGHT}
      >
        <Dot />
        <NotificationContent>
          <MainText
            cursor={CURSOR.POINTER}
          >{`[${t(notification.domain as NOTIFICATION_DOMAIN)}] ${notification.domainTitle}`}</MainText>
          <MainText
            cursor={CURSOR.POINTER}
            color={GRAY.DARK}
            fontWeight={400}
            fontSize={12}
          >
            {'김민수 집사님이 일정 상태를 변경했습니다.'}
          </MainText>
          <MainText
            cursor={CURSOR.POINTER}
            color={GRAY.DARK}
            fontWeight={400}
            fontSize={12}
          >
            {'김민수 집사님이 일정 상태를 변경했습니다.'}
          </MainText>
          <RowContainer>
            <MainText
              cursor={CURSOR.POINTER}
              color={GRAY.DARK}
              fontWeight={400}
              fontSize={12}
            >
              {getTranslatedTimeAgo(locale, notification.createdAt)}
            </MainText>
            <MainText
              cursor={CURSOR.POINTER}
              color={GRAY.DARK}
              fontWeight={400}
              fontSize={12}
            >
              {notification.actorName}
            </MainText>
          </RowContainer>
        </NotificationContent>
      </ItemContainer>
    </>
  );
};

export default NotificationItem;
