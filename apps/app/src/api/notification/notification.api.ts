import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';
import { ORDER_DIRECTION } from '@mokjang/constants';

type GetNotificationsParams = {
  limit: number;
  cursor?: string;
  sortDirection?: ORDER_DIRECTION;
};

type ReadNotificationParams = {
  notificationId: string;
};

export class NotificationApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 알림 조회
   * @param {GetNotificationsParams} params
   */
  public getNotifications = async (params: GetNotificationsParams) => {
    const url = `${this._url}/me/notification`;

    try {
      return await authorizeAxios.get(url, { params });
    } catch (serverError: any) {
      if (serverError.response) {
        const { message, error, statusCode } = serverError.response.data;
        throw new CustomError(message, error, statusCode);
      } else {
        throw new CustomError(
          '알 수 없는 에러가 발생했습니다',
          500,
          'Unknown Error'
        );
      }
    }
  };

  /**
   * 읽지 않은 알림 수 조회
   */
  public getNotificationUnreadCount = async () => {
    const url = `${this._url}/me/notification/unread`;

    try {
      return await authorizeAxios.get(url);
    } catch (serverError: any) {
      if (serverError.response) {
        const { message, error, statusCode } = serverError.response.data;
        throw new CustomError(message, error, statusCode);
      } else {
        throw new CustomError(
          '알 수 없는 에러가 발생했습니다',
          500,
          'Unknown Error'
        );
      }
    }
  };

  /**
   * 모두 읽음 처리
   */
  public readAll = async () => {
    const url = `${this._url}/me/notification/read-all`;

    try {
      return await authorizeAxios.patch(url);
    } catch (serverError: any) {
      if (serverError.response) {
        const { message, error, statusCode } = serverError.response.data;
        throw new CustomError(message, error, statusCode);
      } else {
        throw new CustomError(
          '알 수 없는 에러가 발생했습니다',
          500,
          'Unknown Error'
        );
      }
    }
  };

  /**
   * 해당 알림 읽음 처리
   * @param {ReadNotificationParams} params
   */
  public readNotification = async (params: ReadNotificationParams) => {
    const { notificationId } = params;

    const url = `${this._url}/me/notification/${notificationId}/read`;

    try {
      return await authorizeAxios.patch(url);
    } catch (serverError: any) {
      if (serverError.response) {
        const { message, error, statusCode } = serverError.response.data;
        throw new CustomError(message, error, statusCode);
      } else {
        throw new CustomError(
          '알 수 없는 에러가 발생했습니다',
          500,
          'Unknown Error'
        );
      }
    }
  };
}
