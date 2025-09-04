import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import { BILLING_CYCLE, encData, PLAN } from '@mokjang/models';

type SubscribeBody = {
  isTest: boolean;
  plan: PLAN;
  billingCycle: BILLING_CYCLE;
  encData: encData;
};

export class SubscriptionApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 정기 결제 중인 구독 조회
   */
  public getCurrentSubscription = async () => {
    const url = `${this._url}/subscribe/current`;

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
   * 구독 신청
   * @param {SubscribeBody} body
   */
  public subscribe = async (body: SubscribeBody) => {
    const url = `${this._url}/subscribe/subscribe`;

    try {
      return await authorizeAxios.post(url, body);
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
   * 무료 체험 신청
   */
  public getFreeTrial = async () => {
    const url = `${this._url}/subscribe/trial`;

    try {
      return await authorizeAxios.post(url);
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
   * 구독 플랜 업그레이드
   */
  public upgradeSubscription = async () => {
    const url = `${this._url}/subscribe/upgrade`;

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
   * 구독 플랜 다운그레이드
   */
  public downgradeSubscription = async () => {
    const url = `${this._url}/subscribe/downgrade`;

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
   * 구독 플랜 취소
   */
  public cancelSubscribe = async () => {
    const url = `${this._url}/subscribe/cancel`;

    try {
      return await authorizeAxios.delete(url);
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
   * 구독 플랜 만료
   */
  public expireSubscribe = async () => {
    const url = `${this._url}/subscribe/expire`;

    try {
      return await authorizeAxios.delete(url);
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
