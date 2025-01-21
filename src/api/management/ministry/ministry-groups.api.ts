import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

type GetMinistryGroupsParams = {
  churchId: string;
};

type CreateMinistryGroupParams = {
  churchId: string;
};

type CreateMinistryGroupBody = {
  name: string;
  parentMinistryGroupId: string | null;
};

type GetMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupBody = {
  name?: string;
  parentMinistryGroupId?: string | null;
};

type DeleteMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type GetChildMinistryGroupsParams = {
  churchId: string;
  ministryGroupId: string;
};

export class MinistryGroupsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 그룹 불러오기
   * @param {GetMinistryGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroups = async (
    params: GetMinistryGroupsParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 그룹 만들기
   * @param {CreateMinistryGroupParams} params
   * @param {CreateMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMinistryGroup = async (
    params: CreateMinistryGroupParams,
    body: CreateMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 특정 사역 그룹 불러오기
   * @param {GetMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroup = async (
    params: GetMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 그룹 수정하기
   * @param {EditMinistryGroupParams} params
   * @param {EditMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroup = async (
    params: EditMinistryGroupParams,
    body: EditMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 그룹 삭제하기
   * @param {DeleteMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryGroup = async (
    params: DeleteMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 자식 사역 그룹 불러오기
   * @param {GetChildMinistryGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChildMinistryGroups = async (
    params: GetChildMinistryGroupsParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/childGroups`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
