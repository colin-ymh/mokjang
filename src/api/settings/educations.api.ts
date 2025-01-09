import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

type GetEducationsParams = {
  churchId: string; // 교회 id
};

type CreateEducationParams = {
  churchId: string; // 교회 id
};

type CreateEducationBody = {
  name: string;
};

type EditEducationParams = {
  churchId: string; // 교회 id
  educationId: string;
};

type EditEducationBody = {
  name: string;
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
   * 사역 불러오기
   * @param {GetEducationsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducations = async (
    params: GetEducationsParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/educations`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 만들기
   * @param {CreateEducationParams} params
   * @param {CreateEducationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducation = async (
    params: CreateEducationParams,
    body: CreateEducationBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/educations`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 수정하기
   * @param {EditEducationParams} params
   * @param {EditEducationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducation = async (
    params: EditEducationParams,
    body: EditEducationBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/settings/educations/${educationId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 삭제하기
   * @param {DeleteEducationParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducation = async (
    params: DeleteEducationParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/settings/educations/${educationId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
