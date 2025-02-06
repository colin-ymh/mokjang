import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { EDUCATION_TERM } from '@/constants/management/education-term-column';
import { ORDER_DIRECTION } from '@/constants/constant';
import { CustomError } from '@/api/error/error';

export enum EDUCATION_TERM_ORDER {
  TERM = EDUCATION_TERM.TERM,
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

type GetEducationTermsParams = {
  churchId: string;
  educationId: string;
  order?: EDUCATION_TERM_ORDER;
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
  term: number;
  numberOfSessions: number;
  startDate: string;
  endDate: string;
  completionCriteria?: number;
  instructorId?: number;
};

type EditEducationTermsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationTermsBody = {
  term?: number;
  numberOfSessions: number;
  completionCriteria?: number;
  startDate: string;
  endDate: string;
  instructorId?: number;
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

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms`;

    try {
      return await axios.get(url, {
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

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

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
   * 교육 기수 만들기
   * @param {CreateEducationTermsParams} params
   * @param {CreateEducationTermsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationTerms = async (
    params: CreateEducationTermsParams,
    body: CreateEducationTermsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms`;

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
   * 교육 기수 수정하기
   * @param {EditEducationTermsParams} params
   * @param {EditEducationTermsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationTerms = async (
    params: EditEducationTermsParams,
    body: EditEducationTermsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

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
   * 교육 기수 삭제하기
   * @param {DeleteEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationTerms = async (
    params: DeleteEducationTermsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

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

  /**
   * 교육 기수 출석부 생성/새로고침
   * @param {DeleteEducationTermsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public syncEducationTerms = async (
    params: DeleteEducationTermsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sync-attendance`;

    try {
      return await axios.post(url);
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
