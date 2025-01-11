import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

type GetEducationTermsParams = {
  churchId: string;
  educationId: string;
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
  name: string;
};

type EditEducationTermsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type EditEducationTermsBody = {
  name: string;
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
    const { churchId, educationId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
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
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
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
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
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
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
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
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
