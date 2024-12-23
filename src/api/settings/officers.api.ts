import axios, { AxiosResponse } from "axios";
import { EditMemberBody } from "@/api/churches/members.api";
import { SERVER_URL, TEST_SERVER_URL } from "@/constants/state/url";

class HTTPError extends Error {}

type GetOfficersParams = {
  churchId: string; // 교회 id
};

type CreateOfficerParams = {
  churchId: string; // 교회 id
};

type CreateOfficerBody = {
  name: string;
};

type EditOfficerParams = {
  churchId: string; // 교회 id
  officerId: string;
};

type EditOfficerBody = {
  name: string;
};

type DeleteOfficerParams = {
  churchId: string; // 교회 id
  officerId: string;
};

export class OfficersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 직분 불러오기
   * @param {GetOfficersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOfficers = async (
    params: GetOfficersParams,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/officers`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 직분 만들기
   * @param {CreateOfficerParams} params
   * @param {CreateOfficerBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createOfficer = async (
    params: CreateOfficerParams,
    body: CreateOfficerBody,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/officers`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 직분 수정하기
   * @param {EditOfficerParams} params
   * @param {EditOfficerBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editOfficer = async (
    params: EditOfficerParams,
    body: EditOfficerBody,
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/settings/officers/${officerId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 직분 삭제하기
   * @param {DeleteOfficerParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteOfficer = async (
    params: DeleteOfficerParams,
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/settings/officers/${officerId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
