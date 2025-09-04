import { AxiosResponse } from 'axios';
import qs from 'qs';

import { ORDER_DIRECTION } from '@mokjang/constants';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';
import { WORSHIP } from '@mokjang/constants';

type GetWorshipsParams = {
  churchId: string; // 교회 id
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: WORSHIP; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
};

type GetWorshipParams = {
  churchId: string; // 교회 id
  worshipId: string;
};

type CreateWorshipParams = {
  churchId: string;
};

type CreateWorshipBody = {
  title: string;
  description?: string;
  worshipDay: number;
  repeatPeriod: number;
  worshipTargetGroupIds: string[];
};

type EditWorshipParams = {
  churchId: string;
  worshipId: string;
};

type EditWorshipBody = {
  title?: string;
  description?: string;
  worshipDay?: number;
  repeatPeriod?: number;
  worshipTargetGroupIds?: string[];
};

type DeleteWorshipParams = {
  churchId: string;
  worshipId: string;
};

type GetWorshipStatisticsParams = {
  churchId: string;
  worshipId: string;
  groupId?: string;
  from: string;
  to: string;
};

export class WorshipsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 예배 조회
   * @param {GetWorshipsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getWorships = async (
    params: GetWorshipsParams
  ): Promise<AxiosResponse> => {
    const { churchId, take = 5, page = 1, order, orderDirection } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/worships`;

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
   * 예배 단일 조회
   * @param  {GetWorshipParams} params
   * @returns
   */
  public getWorship = async (
    params: GetWorshipParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}`;

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
   * 예배 생성
   * @param  {CreateWorshipParams} params
   * @param  {CreateWorshipBody} body
   * @returns
   */
  public createWorship = async (
    params: CreateWorshipParams,
    body: CreateWorshipBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/worships`;

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
   * 예배 수정
   * @param  {EditWorshipParams} params
   * @param  {EditWorshipBody} body
   * @returns
   */
  public editWorship = async (
    params: EditWorshipParams,
    body: EditWorshipBody
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}`;

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
   * 예배 삭제
   * @param  {DeleteWorshipParams} params
   * @returns
   */
  public deleteWorship = async (
    params: DeleteWorshipParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}`;

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
   * 예배 조회
   * @param {GetWorshipStatisticsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getWorshipStatistics = async (
    params: GetWorshipStatisticsParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, groupId, from, to } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/statistics`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          groupId,
          from,
          to,
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
}
