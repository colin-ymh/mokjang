import axios, { AxiosResponse } from "axios";
import { EditMemberBody } from "@/api/churches/members.api";
import { SERVER_URL, TEST_SERVER_URL } from "@/constants/state/url";

class HTTPError extends Error {}

type GetMinistriesParams = {
  churchId: string; // 교회 id
};

type CreateMinistryParams = {
  churchId: string; // 교회 id
};

type CreateMinistryBody = {
  name: string;
};

type EditMinistryParams = {
  churchId: string; // 교회 id
  ministryId: string;
};

type EditMinistryBody = {
  name: string;
};

type DeleteMinistryParams = {
  churchId: string; // 교회 id
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
    params: GetMinistriesParams,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/ministries`;

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
    body: CreateMinistryBody,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/ministries`;

    try {
      return await axios.post(url, body);
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
    body: EditMinistryBody,
  ): Promise<AxiosResponse> => {
    const { churchId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/settings/ministries/${ministryId}`;

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
    params: DeleteMinistryParams,
  ): Promise<AxiosResponse> => {
    const { churchId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/settings/ministries/${ministryId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
