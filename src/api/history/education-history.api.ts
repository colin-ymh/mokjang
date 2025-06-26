import { AxiosResponse } from 'axios';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';
import { EDUCATION_ENROLLMENT_STATUS } from '@/constants/status/status';

type GetEducationHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
};

type createEducationHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type createEducationHistoryBody = {
  educationId: string;
  status: EDUCATION_ENROLLMENT_STATUS;
  startDate: string;
  endDate?: string;
};

type editEducationHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  educationHistoryId: string;
};

type editEducationHistoryBody = {
  educationId?: string;
  status?: EDUCATION_ENROLLMENT_STATUS;
  startDate?: string;
  endDate?: string;
};

type deleteEducationHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  educationHistoryId: string;
};

export class EducationHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교육 이력 조회
   * @param {GetEducationHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationHistory = async (
    params: GetEducationHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/educations`;

    try {
      return await authorizeAxios.get(url, {
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
   * 교육 이력 생성
   * @param {createEducationHistoryParams} params
   * @param {createEducationHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationHistory = async (
    params: createEducationHistoryParams,
    body: createEducationHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/educations`;

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
   * 교육 이력 수정
   * @param {editEducationHistoryParams} params
   * @param {editEducationHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationHistory = async (
    params: editEducationHistoryParams,
    body: editEducationHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, educationHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/educations/${educationHistoryId}`;

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
   * 교육 이력 삭제
   * @param {deleteEducationHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationHistory = async (
    params: deleteEducationHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, educationHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/educations/${educationHistoryId}`;

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
