import { AxiosResponse } from 'axios';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';

class HTTPError extends Error {}

type createChurchBody = {
  name: string;
  identifyNumber: string;
  phone: string;
  denomination: string;
  address: string;
  detailAddress: string;
  memberSize: string;
};

type getChurchParams = {
  churchId: string;
};

type editChurchParams = {
  churchId: string;
};

type editChurchBody = {
  name?: string;
  identifyNumber?: string;
  phone?: string;
  denomination?: string;
  address?: string;
  detailAddress?: string;
  memberSize?: string;
};

type deleteChurchParams = {
  churchId: string;
};

export class ChurchesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회 생성
   * @param {createChurchBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createChurch = async (
    body: createChurchBody
  ): Promise<AxiosResponse> => {
    const url = `${this._url}/churches`;

    try {
      return await authorizeAxios.post(url.toString(), body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교회 조회
   * @param {getChurchParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChurch = async (
    params: getChurchParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;
    const url = `${this._url}/churches/${churchId}`;

    try {
      return await authorizeAxios.get(url.toString());
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교회 수정
   * @param {editChurchParams} params
   * @param {editChurchBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public getVerificationRequest = async (
    params: editChurchParams,
    body: editChurchBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;
    const url = `${this._url}/churches/${churchId}`;

    try {
      return await authorizeAxios.patch(url.toString(), body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교회 삭제
   * @param {deleteChurchParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteChurch = async (
    params: deleteChurchParams
  ): Promise<AxiosResponse> => {
    const url = new URL('/churches', this._url);

    try {
      return await authorizeAxios.delete(url.toString());
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
