import { Notification } from '@mokjang/models';
import { MainText } from '@mokjang/components';
import styled from 'styled-components';
import { CURSOR, GRAY, LOCALE, MAIN, WHITE } from '@mokjang/constants';
import { getTranslatedTimeAgo } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { useI18n } from '../../../../locales/client';
import {
  getTranslatedNotificationMention,
  getTranslatedNotificationSubMentions,
} from '@/utils/notification';

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
  width: 100%;
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

export type NotificationItemViewProps = {
  notification: Notification;
  onClickItem: () => void;
};

const NotificationItemView = ({
  notification,
  onClickItem,
}: NotificationItemViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const t = useI18n();

  return (
    <>
      <ItemContainer
        onClick={onClickItem}
        $backgroundColor={notification.isRead ? WHITE : MAIN.EXTRA_LIGHT}
      >
        {!notification.isRead && <Dot />}
        <NotificationContent>
          <MainText
            cursor={CURSOR.POINTER}
            whiteSpace={'normal'}
            maxWidth={350}
          >
            {getTranslatedNotificationMention(locale, notification, t)}
          </MainText>
          {getTranslatedNotificationSubMentions(locale, notification, t).map(
            (subMention: string, index) => (
              <MainText
                key={`${subMention}-${index}`}
                cursor={CURSOR.POINTER}
                color={GRAY.DARK}
                fontWeight={400}
                fontSize={12}
              >
                {subMention}
              </MainText>
            )
          )}
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

export default NotificationItemView;
