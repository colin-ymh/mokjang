import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

type GetEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
};

type GetEducationTermParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type CreateEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
};

type CreateEducationEnrollmentsBody = {
  name: string;
};

type EditEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationEnrollmentsBody = {
  name: string;
};

type DeleteEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

export class EducationEnrollmentsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 대상자 상태 불러오기
   * @param {GetEducationEnrollmentsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationEnrollments = async (
    params: GetEducationEnrollmentsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 특정 교육 대상자 상태 불러오기
   * @param {GetEducationEnrollmentsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationTerm = async (
    params: GetEducationTermParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 대상자 상태 만들기
   * @param {CreateEducationEnrollmentsParams} params
   * @param {CreateEducationEnrollmentsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationEnrollments = async (
    params: CreateEducationEnrollmentsParams,
    body: CreateEducationEnrollmentsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 대상자 상태 수정하기
   * @param {EditEducationEnrollmentsParams} params
   * @param {EditEducationEnrollmentsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationEnrollments = async (
    params: EditEducationEnrollmentsParams,
    body: EditEducationEnrollmentsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육 대상자 상태 삭제하기
   * @param {DeleteEducationEnrollmentsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationEnrollments = async (
    params: DeleteEducationEnrollmentsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
