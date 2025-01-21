import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';

class HTTPError extends Error {}

type GetMinistriesParams = {
  churchId: string;
  ministryGroupId?: string;
  order?: string;
  orderDirection?: ORDER_DIRECTION;
};

type CreateMinistryParams = {
  churchId: string;
};

type CreateMinistryBody = {
  name: string;
  ministryGroupId: string;
};

type GetMinistryParams = {
  churchId: string;
  ministryId: string;
};

type EditMinistryParams = {
  churchId: string;
  ministryId: string;
};

type EditMinistryBody = {
  name?: string;
  ministryGroupId?: string;
};

type DeleteMinistryParams = {
  churchId: string;
  ministryId: string;
};

export class MinistriesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 불러오기
   * @param {GetMinistriesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistries = async (
    params: GetMinistriesParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministries`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 만들기
   * @param {CreateMinistryParams} params
   * @param {CreateMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMinistry = async (
    params: CreateMinistryParams,
    body: CreateMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministries`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 특정 사역 불러오기
   * @param {GetMinistryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistry = async (
    params: GetMinistryParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministries/${ministryId}`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 수정하기
   * @param {EditMinistryParams} params
   * @param {EditMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistry = async (
    params: EditMinistryParams,
    body: EditMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministries/${ministryId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 삭제하기
   * @param {DeleteMinistryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistry = async (
    params: DeleteMinistryParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministries/${ministryId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
