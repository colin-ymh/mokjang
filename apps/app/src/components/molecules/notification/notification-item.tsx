import { Notification, NOTIFICATION_DOMAIN } from '@mokjang/models';
import { usePageRouter } from '@mokjang/utils';
import { NotificationApi } from '@/api/notification/notification.api';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchNotificationCount,
  fetchNotifications,
  resetNotifications,
} from '@/redux/reducers/notification-reducer';
import {
  openEducationSession,
  openEducationTerm,
  openManager,
  openMyInformation,
  openTaskModal,
  openVisitationModal,
} from '@/redux/reducers/modal-reducer';
import NotificationItemView, {
  NotificationItemViewProps,
} from '@/components/molecules/notification/notification-item.view';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLANK, DESTRUCTIVE } from '@mokjang/constants';

type NotificationItemProps = {
  notification: Notification;
  onClickClose: () => void;
};

const NotificationItem = ({
  notification,
  onClickClose,
}: NotificationItemProps) => {
  const router = usePageRouter();

  const dispatch = useDispatch<AppDispatch>();

  const notificationsApi = new NotificationApi();

  const onClickItem = async () => {
    try {
      if (!notification.isRead) {
        // 1) 읽음 처리 (fire-and-forget 가능)
        await notificationsApi.readNotification({
          notificationId: notification.id,
        });
        // 읽음 카운트/목록 갱신
        dispatch(resetNotifications());
        dispatch(fetchNotifications());
        dispatch(fetchNotificationCount());
      }

      // 2) 도메인별 이동/모달 열기
      const src = notification?.sourceInfo;
      const domain = notification.domain;
      const id = String(src?.id ?? '');

      switch (domain) {
        case NOTIFICATION_DOMAIN.CHURCH_INFO: {
          // 모달 열기 먼저
          router.push('/management/church/church');
          return;
        }
        case NOTIFICATION_DOMAIN.TASK: {
          // 모달 열기 먼저
          dispatch(openTaskModal({ id }));
          // 목록 라우팅
          router.push('/main/task/all');
          return;
        }
        case NOTIFICATION_DOMAIN.VISITATION: {
          // 모달 열기 먼저
          dispatch(openVisitationModal({ id }));
          // 목록 라우팅
          router.push('/main/visitation/all');
          return;
        }

        case NOTIFICATION_DOMAIN.PERMISSION: {
          dispatch(openMyInformation());
          return;
        }

        case NOTIFICATION_DOMAIN.MANAGER: {
          if (notification.domainTitle === BLANK) {
            dispatch(openMyInformation());
          } else {
            dispatch(openManager({ id }));
            router.push('/main/manager/manager');
          }
          return;
        }

        case NOTIFICATION_DOMAIN.EDUCATION_TERM: {
          const educationId = notification.sourceInfo?.educationId as string;
          dispatch(openEducationTerm({ id, educationId }));
          router.push('/main/education/all');
          return;
        }

        case NOTIFICATION_DOMAIN.EDUCATION_SESSION: {
          const educationId = notification.sourceInfo?.educationId as string;
          const educationTermId = notification.sourceInfo
            ?.educationTermId as string;
          dispatch(openEducationSession({ id, educationId, educationTermId }));
          router.push('/main/education/all');
          return;
        }

        default:
          // 목적지 미정이면 그냥 종료
          return;
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      }
    } finally {
      onClickClose();
    }
  };

  const props = {
    notification,
    onClickItem,
  } as NotificationItemViewProps;

  return (
    <>
      <NotificationItemView {...props} />
    </>
  );
};

export default NotificationItem;
