import { AxiosResponse } from 'axios';
import { CustomError } from '../error/error';
import { ORDER_DIRECTION } from '@mokjang/constants';
import authorizeAxios from '../authorize-axios';

import { EDUCATION, EDUCATION_TERM } from '@mokjang/constants';
import qs from 'qs';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

type GetEducationsParams = {
  churchId: string; // 교회 id
  take?: number;
  page?: number;
  order?: EDUCATION;
  orderDirection?: ORDER_DIRECTION;
  name?: string;
};

type GetInProgressEducationsParams = {
  churchId: string; // 교회 id
  take?: number;
  page?: number;
  order?: EDUCATION_TERM;
  orderDirection?: ORDER_DIRECTION;
  name?: string;
};

type GetEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

type CreateEducationParams = {
  churchId: string; // 교회 id
};

type CreateEducationBody = {
  name: string;
  description?: string;
  goals: string[];
};

type EditEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

type EditEducationBody = {
  name?: string;
  description?: string;
};

type DeleteEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

export class EducationsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 불러오기
   * @param {GetEducationsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducations = async (
    params: GetEducationsParams
  ): Promise<AxiosResponse> => {
    const { churchId, take = 5, page = 1, orderDirection, name } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        name,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/educations`;

    try {
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
   * 진행중인 교육 불러오기
   * @param {GetInProgressEducationsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getInProgressEducations = async (
    params: GetInProgressEducationsParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/educations/in-progress`;

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
   * 특정 교육 불러오기
   * @param {GetEducationParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducation = async (
    params: GetEducationParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}`;

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
   * 교육 만들기
   * @param {CreateEducationParams} params
   * @param {CreateEducationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducation = async (
    params: CreateEducationParams,
    body: CreateEducationBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/educations`;

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
   * 교육 수정하기
   * @param {EditEducationParams} params
   * @param {EditEducationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducation = async (
    params: EditEducationParams,
    body: EditEducationBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}`;

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
   * 교육 삭제하기
   * @param {DeleteEducationParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducation = async (
    params: DeleteEducationParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}`;

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
