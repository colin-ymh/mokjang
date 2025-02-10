import axios, { AxiosResponse } from 'axios';

import { CustomError } from '@/api/error/error';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';

type GetGroupHistoryParams = {
  churchId: string;
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
};

type createGroupHistoryParams = {
  churchId: string;
  memberId: string;
};

type createGroupHistoryBody = {
  groupId: string;
  groupRoleId?: string;
  startDate?: string;
};

type stopGroupHistoryParams = {
  churchId: string;
  memberId: string;
};

type stopGroupHistoryBody = {
  endDate?: string;
};

type editGroupHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
};

type editGroupHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type deleteGroupHistoryParams = {
  churchId: string;
  memberId: string;
  groupHistoryId: string;
};

export class GroupHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
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
    const { churchId, memberId, orderDirection } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups`;

    try {
      return await axios.get(url, {
        params: {
          orderDirection,
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
   * 그룹 이력 생성
   * @param {createGroupHistoryParams} params
   * @param {createGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createGroupHistory = async (
    params: createGroupHistoryParams,
    body: createGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups`;

    try {
      return await axios.post(url, body);
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
   * 그룹 종료
   * @param {stopGroupHistoryParams} params
   * @param {stopGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public stopGroupHistory = async (
    params: stopGroupHistoryParams,
    body: stopGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups/`;

    try {
      return await axios.delete(url, {
        data: body,
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
   * @param {editGroupHistoryParams} params
   * @param {editGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupHistory = async (
    params: editGroupHistoryParams,
    body: editGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups/${groupHistoryId}`;

    try {
      return await axios.patch(url, body);
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
   * @param {deleteGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupHistory = async (
    params: deleteGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups/${groupHistoryId}`;

    try {
      return await axios.delete(url);
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
