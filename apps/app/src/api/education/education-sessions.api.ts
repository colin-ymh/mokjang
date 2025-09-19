import { AxiosResponse } from 'axios';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';

import { TASK_STATUS } from '@mokjang/constants';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

type GetEducationSessionsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  take?: number;
  page?: number;
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

type CreateEducationSessionBody = {
  title: string;
  startDate: string;
  endDate: string;
  inChargeId?: string;
  content: string;
  status?: TASK_STATUS;
  receiverIds: string[];
};

type EditEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type EditEducationSessionBody = {
  title?: string;
  startDate?: string;
  endDate?: string;
  inChargeId?: string;
  content?: string;
  status?: TASK_STATUS;
};

type DeleteEducationSessionParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type AddReceiversParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type AddReceiversBody = {
  receiverIds: string[];
};

type DeleteReceiversParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type DeleteReceiversBody = {
  receiverIds: string[];
};

export class EducationSessionsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
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
    const { churchId, educationId, educationTermId, take, page } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          take,
          page,
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
   * 특정 교육 회차 상태 불러오기
   * @param {GetEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationSession = async (
    params: GetEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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
   * 교육 회차 상태 만들기
   * @param {CreateEducationSessionParams} params
   * @param {CreateEducationSessionParams} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationSession = async (
    params: CreateEducationSessionParams,
    body: CreateEducationSessionBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions`;

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

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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
   * 교육 회차 상태 삭제하기
   * @param {DeleteEducationSessionParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationSession = async (
    params: DeleteEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

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

  public addReceivers = async (
    params: AddReceiversParams,
    body: AddReceiversBody
  ) => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}/add-receivers`;

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

  public deleteReceivers = async (
    params: DeleteReceiversParams,
    body: DeleteReceiversBody
  ) => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}/delete-receivers`;

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
}
