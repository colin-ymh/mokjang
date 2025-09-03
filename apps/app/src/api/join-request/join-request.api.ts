import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import { CHURCH_USER_ROLE, ORDER_DIRECTION } from '@mokjang/constants';
import { JOIN_REQUEST } from '@mokjang/constants';
import { JOIN_REQUEST_STATUS } from '@mokjang/constants';
import { USER } from '@mokjang/constants';

type CreateJoinRequestBody = {
  joinCode: string;
};

type GetJoinRequestsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: JOIN_REQUEST | USER;
  orderDirection?: ORDER_DIRECTION;
  fromCreatedAt?: string;
  toCreatedAt?: string;
  status: JOIN_REQUEST_STATUS;
};

type ApproveJoinRequestParams = {
  churchId: string;
  joinId: string;
};

type ApproveJoinRequestBody = {
  linkMemberId: string;
  userRole: CHURCH_USER_ROLE;
};

type RejectJoinRequestParams = {
  churchId: string;
  joinId: string;
};

type DeleteJoinRequestParams = {
  churchId: string;
  joinId: string;
};

export class JoinRequestsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회 가입 신청
   * @param {CreateJoinRequestBody} body
   */
  public createJoinRequest = async (body: CreateJoinRequestBody) => {
    const url = `${this._url}/churches/join`;

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
   * 교회 가입 신청 목록 조회
   * @returns {Promise<AxiosResponse>}
   */
  public getJoinRequests = async (
    params: GetJoinRequestsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      orderDirection = ORDER_DIRECTION,
      order,
      fromCreatedAt,
      toCreatedAt,
      status,
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        order,
        fromCreatedAt,
        toCreatedAt,
        status,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/join`;

    try {
      /* ③axios 호출 + qs 직렬화 --------------------------------------- */
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          }),
      });
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
   * 교회 가입 신청 허가
   * @param {ApproveJoinRequestParams} params
   * @param {ApproveJoinRequestBody} body
   */
  public approveJoinRequest = async (
    params: ApproveJoinRequestParams,
    body: ApproveJoinRequestBody
  ) => {
    const { churchId, joinId } = params;

    const url = `${this._url}/churches/${churchId}/join/${joinId}/approve`;

    try {
      return await authorizeAxios.patch(url, body);
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
   * 교회 가입 신청 거절
   * @param {RejectJoinRequestParams} params
   */
  public rejectJoinRequest = async (params: RejectJoinRequestParams) => {
    const { churchId, joinId } = params;

    const url = `${this._url}/churches/${churchId}/join/${joinId}/reject`;

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

  public deleteJoinRequest = async (params: DeleteJoinRequestParams) => {
    const { churchId, joinId } = params;

    const url = `${this._url}/churches/${churchId}/join/${joinId}`;

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
