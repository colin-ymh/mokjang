import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

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

type CreateEducationSessionsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationSessionsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationSessionId: string;
};

type EditEducationSessionsBody = {
  content?: string;
  deleteContent?: boolean;
};

type DeleteEducationSessionsParams = {
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
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 특정 교육 회차 상태 불러오기
   * @param {GetEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationTerm = async (
    params: GetEducationSessionParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 회차 상태 만들기
   * @param {CreateEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationSessions = async (
    params: CreateEducationSessionsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions`;

    try {
      return await axios.post(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 회차 상태 수정하기
   * @param {EditEducationSessionsParams} params
   * @param {EditEducationSessionsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationSessions = async (
    params: EditEducationSessionsParams,
    body: EditEducationSessionsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 회차 상태 삭제하기
   * @param {DeleteEducationSessionsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationSessions = async (
    params: DeleteEducationSessionsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationSessionId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${educationSessionId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
