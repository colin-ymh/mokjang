import { AxiosResponse } from 'axios';
import qs from 'qs';

import { ORDER_DIRECTION, WORSHIP_SESSION } from '@mokjang/constants';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';


type GetWorshipSessionsParams = {
  churchId: string; // 교회 id
  worshipId: string;
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: WORSHIP_SESSION; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
};

type GetWorshipSessionParams = {
  churchId: string; // 교회 id
  worshipId: string;
  sessionDate?: string;
};

type GetWorshipSessionByDateParams = {
  churchId: string; // 교회 id
  worshipId: string;
  sessionDate: string;
};

type EditWorshipSessionParams = {
  churchId: string;
  worshipId: string;
  sessionId: string;
};

type EditWorshipSessionBody = {
  title?: string;
  bibleTitle?: string;
  description?: string;
  videoUrl?: string;
  inChargeId?: string;
};

type DeleteWorshipSessionsParams = {
  churchId: string;
  worshipId: string;
  sessionId: string;
};

type GetWorshipSessionCheckStatusParams = {
  churchId: string;
  worshipId: string;
  groupId?: string;
  from?: string;
  to?: string;
};

type GetWorshipSessionStatisticsParams = {
  churchId: string;
  sessionId: string;
  worshipId: string;
  groupId?: string;
};

export class WorshipSessionsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 예배 회차 조회
   * @param {GetWorshipSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getWorshipSessions = async (
    params: GetWorshipSessionsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      worshipId,
      take = 5,
      page = 1,
      order,
      orderDirection,
    } = params;

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

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions`;

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
   * 예배 회차 단일 조회
   * @param  {GetWorshipSessionParams} params
   * @returns
   */
  public getWorshipSession = async (
    params: GetWorshipSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionDate } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions`;

    try {
      return await authorizeAxios.post(url, '', {
        params: { sessionDate },
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
   * 예배 회차 단일 조회
   * @param  {GetWorshipSessionByDateParams} params
   * @returns
   */
  public getWorshipSessionByDate = async (
    params: GetWorshipSessionByDateParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionDate } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions`;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        sessionDate,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

    try {
      return await authorizeAxios.post(url, '', {
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
   * 예배 회차 수정
   * @param  {EditWorshipSessionParams} params
   * @param  {EditWorshipSessionBody} body
   * @returns
   */
  public editWorshipSession = async (
    params: EditWorshipSessionParams,
    body: EditWorshipSessionBody
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}`;

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
   * 예배 회차 삭제
   * @param  {DeleteWorshipSessionsParams} params
   * @returns
   */
  public deleteWorshipSessions = async (
    params: DeleteWorshipSessionsParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}`;

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
   * 예배 회차별 출석확인률 조회
   * @param  {GetWorshipSessionCheckStatusParams} params
   * @returns
   */
  public getWorshipSessionCheckStatus = async (
    params: GetWorshipSessionCheckStatusParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, groupId, from, to } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/check-status`;

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

  /**
   * 예배 회차 통계 조회
   * @param  {GetWorshipSessionStatisticsParams} params
   * @returns
   */
  public getWorshipSessionStatistics = async (
    params: GetWorshipSessionStatisticsParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/statistics`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          groupId,
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
