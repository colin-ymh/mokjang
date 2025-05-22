import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';

type GetEducationSessionsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type GetEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type CreateEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type EditEducationSessionBody = {
  isDone?: boolean;
  sessionDate?: string;
  content?: string;
};

type DeleteEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

export class EducationSessionsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 회차 상태 불러오기
   * @param {GetEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationSessions = async (
    params: GetEducationSessionsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions`;

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
   * 특정 교육 회차 상태 불러오기
   * @param {GetEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationSession = async (
    params: GetEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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
   * 교육 회차 상태 만들기
   * @param {CreateEducationSessionParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationSession = async (
    params: CreateEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions`;

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

  /**
   * 교육 회차 상태 수정하기
   * @param {EditEducationSessionParams} params
   * @param {EditEducationSessionBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationSession = async (
    params: EditEducationSessionParams,
    body: EditEducationSessionBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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
   * 교육 회차 상태 삭제하기
   * @param {DeleteEducationSessionParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationSession = async (
    params: DeleteEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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
