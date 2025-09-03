import { AxiosResponse } from 'axios';

import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import qs from 'qs';

type GetBirthdaysParams = {
  churchId: string;
  fromDate: string;
  toDate: string;
};

type GetEducationsParams = {
  churchId: string;
  fromDate: string;
  toDate: string;
};

type GetEducationDetailParams = {
  churchId: string;
  educationSessionId: string;
};

export class CalendarApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 생일 조회
   * @param {GetBirthdaysParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getBirthdays = async (
    params: GetBirthdaysParams
  ): Promise<AxiosResponse> => {
    const { churchId, fromDate, toDate } = params;
    const url = `${this._url}/churches/${churchId}/calendar/birthday`;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        fromDate,
        toDate,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

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
   * 교육 조회
   * @param {GetEducationsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducations = async (
    params: GetEducationsParams
  ): Promise<AxiosResponse> => {
    const { churchId, fromDate, toDate } = params;
    const url = `${this._url}/churches/${churchId}/calendar/educations`;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        fromDate,
        toDate,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

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
   * 교육 상세 조회
   * @param {GetEducationDetailParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationDetail = async (
    params: GetEducationDetailParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationSessionId } = params;
    const url = `${this._url}/churches/${churchId}/calendar/educations/${educationSessionId}`;

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
}
