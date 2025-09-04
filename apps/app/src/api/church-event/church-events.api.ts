import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';

type GetChurchEventsParams = {
  churchId: string;
  fromDate: string;
  toDate: string;
};

type CreateChurchEventParams = {
  churchId: string;
};

type CreateChurchEventBody = {
  title: string;
  date: string;
  description: string;
};

type GetChurchEventParams = {
  churchId: string;
  eventId: string;
};

type EditChurchEventParams = {
  churchId: string;
  eventId: string;
};

type EditChurchEventBody = {
  title?: string;
  date?: string;
  description?: string;
};

type DeleteChurchEventParams = {
  churchId: string;
  eventId: string;
};

export class ChurchEventsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 이벤트 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getChurchEvents = async (
    params: GetChurchEventsParams
  ): Promise<AxiosResponse> => {
    const { churchId, fromDate, toDate } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        fromDate,
        toDate,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/calendar/events`;

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
   * 이벤트 생성
   *
   * @param {CreateChurchEventParams} params
   * @param {CreateChurchEventBody} body
   */
  public createChurchEvent = async (
    params: CreateChurchEventParams,
    body: CreateChurchEventBody
  ) => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/calendar/events`;

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
   * 이벤트 조회
   *
   * @param {GetChurchEventParams} params
   */
  public getChurchEvent = async (params: GetChurchEventParams) => {
    const { churchId, eventId } = params;

    const url = `${this._url}/churches/${churchId}/calendar/events/${eventId}`;

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
   * 이벤트 수정
   *
   * @param {EditChurchEventParams} params
   * @param {EditChurchEventBody} body
   */
  public editChurchEvent = async (
    params: EditChurchEventParams,
    body: EditChurchEventBody
  ) => {
    const { churchId, eventId } = params;

    const url = `${this._url}/churches/${churchId}/calendar/events/${eventId}`;

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
   * 이벤트 삭제
   *
   * @param {DeleteChurchEventParams} params
   */
  public deleteChurchEvent = async (params: DeleteChurchEventParams) => {
    const { churchId, eventId } = params;

    const url = `${this._url}/churches/${churchId}/calendar/events/${eventId}`;

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
