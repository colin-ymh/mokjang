import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { ORDER_DIRECTION } from '@mokjang/constants';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';

type getOfficerHistoryParams = {
  churchId: string;
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
  take?: number;
  page?: number;
};

type editOfficerHistoryParams = {
  churchId: string;
  memberId: string;
  officerHistoryId: string;
};

type editOfficerHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type deleteOfficerHistoryParams = {
  churchId: string;
  memberId: string;
  officerHistoryId: string;
};

export class OfficerHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 직분 이력 조회
   * @param {getOfficerHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOfficerHistory = async (
    params: getOfficerHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection, take, page } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/officers`;

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
   * 직분 이력 수정
   * @param {editOfficerHistoryParams} params
   * @param {editOfficerHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editOfficerHistory = async (
    params: editOfficerHistoryParams,
    body: editOfficerHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, officerHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/officers/${officerHistoryId}`;

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
   * 직분 이력 삭제
   * @param {deleteOfficerHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteOfficerHistory = async (
    params: deleteOfficerHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, officerHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/officers/${officerHistoryId}`;

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
