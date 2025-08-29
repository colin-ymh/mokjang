import { AxiosResponse } from 'axios';
import qs from 'qs';

import { CHURCH_USER_ROLE, ORDER_DIRECTION } from '../../constants/constant';
import { SERVER_URL, TEST_SERVER_URL } from '../../constants/state/url';
import { CustomError } from '../error/error';
import { CHURCH_USER } from '../../constants/column/church-user-column';
import authorizeAxios from '../authorize-axios';

type GetChurchUsersParams = {
  churchId: string; // 교회 id
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: CHURCH_USER; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  name?: string;
  role?: CHURCH_USER_ROLE;
};

type GetChurchUserParams = {
  churchId: string; // 교회 id
  churchUserId: string;
};

type LinkMemberParams = {
  churchId: string;
  churchUserId: string;
};

type LinkMemberBody = {
  linkMemberId: string;
};

type UnlinkMemberParams = {
  churchId: string;
  churchUserId: string;
};

type LeaveChurchParams = {
  churchId: string;
  churchUserId: string;
};

export class ChurchUsersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회 가입 계정 조회
   * @param {GetChurchUsersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChurchUsers = async (
    params: GetChurchUsersParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      order,
      orderDirection,
      name,
      role,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        name,
        role,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/church-users`;

    try {
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          });
        },
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
   * 교회 가입 계정 단일 조회
   * @param  {GetChurchUserParams} params
   * @returns
   */
  public getChurchUser = async (
    params: GetChurchUserParams
  ): Promise<AxiosResponse> => {
    const { churchId, churchUserId } = params;

    const url = `${this._url}/churches/${churchId}/church-users/${churchUserId}`;

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
   * 계정-교인 정보 연결
   * @param  {LinkMemberParams} params
   * @param  {LinkMemberBody} body
   * @returns
   */
  public linkMember = async (
    params: LinkMemberParams,
    body: LinkMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, churchUserId } = params;

    const url = `${this._url}/churches/${churchId}/church-users/${churchUserId}/link-member`;

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
   * 계정-교인 정보 연결 해제
   * @param  {UnlinkMemberParams} params
   * @returns
   */
  public unlinkMember = async (
    params: UnlinkMemberParams
  ): Promise<AxiosResponse> => {
    const { churchId, churchUserId } = params;

    const url = `${this._url}/churches/${churchId}/church-users/${churchUserId}/unlink-member`;

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
   * 계정-교인 정보 연결
   * @param  {LeaveChurchParams} params
   * @returns
   */
  public leaveChurch = async (
    params: LeaveChurchParams
  ): Promise<AxiosResponse> => {
    const { churchId, churchUserId } = params;

    const url = `${this._url}/churches/${churchId}/church-users/${churchUserId}/leave-church`;

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
