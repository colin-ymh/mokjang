import { Notification } from '@mokjang/models';
import NotificationModal from '@/components/organisms/notification/notification-modal';
import { useI18n } from '../../../../locales/client';
import { MainText } from '@mokjang/components';
import styled from 'styled-components';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NotificationContent = styled.div`
  display: flex;
  flex-direction: column;
`;

type NotificationItemProps = {
  notification: Notification;
};

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const t = useI18n();
  return (
    <>
      <ItemContainer>
        <MainText></MainText>
      </ItemContainer>
    </>
  );
};

export default NotificationModal;
