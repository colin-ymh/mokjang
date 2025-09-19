import { AxiosResponse } from 'axios';

import { CustomError } from '../error/error';
import { ORDER_DIRECTION } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

type GetGroupHistoryParams = {
  churchId: string;
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
  take?: number;
  page?: number;
};

type EditGroupHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
};

type EditGroupHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type DeleteGroupHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
};

type GetGroupDetailHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
  orderDirection?: ORDER_DIRECTION;
  take?: number;
  page?: number;
};

type EditGroupDetailHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
  detailHistoryId: string;
};

type EditGroupDetailHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type DeleteGroupDetailHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
  detailHistoryId: string;
};

export class GroupHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 그룹 이력 조회
   * @param {GetGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroupHistory = async (
    params: GetGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection, take, page } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          orderDirection,
          take,
          page,
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
   * 그룹 이력 수정
   * @param {EditGroupHistoryParams} params
   * @param {EditGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupHistory = async (
    params: EditGroupHistoryParams,
    body: EditGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups/${groupHistoryId}`;

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
   * 그룹 이력 삭제
   * @param {DeleteGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupHistory = async (
    params: DeleteGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups/${groupHistoryId}`;

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
   * 그룹 이력 조회
   * @param {GetGroupDetailHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroupDetailHistory = async (
    params: GetGroupDetailHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId, orderDirection, take, page } =
      params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups${groupHistoryId}/details`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          orderDirection,
          take,
          page,
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
   * 그룹 이력 수정
   * @param {EditGroupDetailHistoryParams} params
   * @param {EditGroupDetailHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupDetailHistory = async (
    params: EditGroupDetailHistoryParams,
    body: EditGroupDetailHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId, detailHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups${groupHistoryId}/details/${detailHistoryId}`;

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
   * 그룹 이력 삭제
   * @param {DeleteGroupDetailHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupDetailHistory = async (
    params: DeleteGroupDetailHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId, detailHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/groups${groupHistoryId}/details/${detailHistoryId}`;

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
