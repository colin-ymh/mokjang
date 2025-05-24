import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import axios from '@/api/authorize-axios';
import authorizeAxios from '@/api/authorize-axios';

import { EDUCATION } from '@/constants/education/education-column';

type GetEducationsParams = {
  churchId: string; // 교회 id
  take?: number;
  page?: number;
  order?: EDUCATION;
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
};

type EditEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

type EditEducationBody = {
  name: string;
  description?: string;
};

type DeleteEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

export class EducationsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
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
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations`;

    try {
      return await axios.get(url);
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

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}`;

    try {
      return await axios.get(url);
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

    const url = `${this._url}/churches/${churchId}/management/educations`;

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

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}`;

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
   * 교육 삭제하기
   * @param {DeleteEducationParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducation = async (
    params: DeleteEducationParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}`;

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
