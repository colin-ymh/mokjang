import { LOCALE } from '@mokjang/constants';
import { Notification } from '@mokjang/models';
/**
 * 메인 함수: 로케일별 알림 문구 생성
 */
export declare const getTranslatedNotificationContent: (basePath: LOCALE, notification: Notification) => string;
