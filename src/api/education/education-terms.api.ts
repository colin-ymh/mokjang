import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { EDUCATION_TERM } from '@/constants/column/education-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';

import { TASK_STATUS } from '@/constants/status/status';

type GetEducationTermsParams = {
  churchId: string;
  educationId: string;
  take?: number;
  page?: number;
  order?: EDUCATION_TERM;
  orderDirection?: ORDER_DIRECTION;
};

type GetEducationTermParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type CreateEducationTermsParams = {
  churchId: string;
  educationId: string;
};

type CreateEducationTermsBody = {
  term: string;
  startDate: string;
  endDate: string;
  location?: string;
  inChargeId?: string;
};

type EditEducationTermParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationTermBody = {
  term?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: TASK_STATUS;
  inChargeId?: string;
};

type DeleteEducationTermsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

export class EducationTermsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 기수 불러오기
   * @param {GetEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationTerms = async (
    params: GetEducationTermsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      educationId,
      order,
      orderDirection = ORDER_DIRECTION.DESC,
    } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          order,
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
   * 특정 교육 기수 불러오기
   * @param {GetEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationTerm = async (
    params: GetEducationTermParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}`;

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
   * 교육 기수 만들기
   * @param {CreateEducationTermsParams} params
   * @param {CreateEducationTermsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationTerm = async (
    params: CreateEducationTermsParams,
    body: CreateEducationTermsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms`;

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
   * 교육 기수 수정하기
   * @param {EditEducationTermParams} params
   * @param {EditEducationTermBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationTerm = async (
    params: EditEducationTermParams,
    body: EditEducationTermBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}`;

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
   * 교육 기수 삭제하기
   * @param {DeleteEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationTerm = async (
    params: DeleteEducationTermsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}`;

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
   * 교육 기수 출석부 생성/새로고침
   * @param {DeleteEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public syncEducationTerms = async (
    params: DeleteEducationTermsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sync-attendance`;

    try {
      return await authorizeAxios.post(url);
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
