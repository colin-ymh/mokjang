import axios, { AxiosResponse } from "axios";
import { EditMemberBody } from "@/api/churches/members.api";

class HTTPError extends Error {}

type GetGroupsParams = {
  churchId: string; // 교회 id
};

type GetChildGroupsParams = {
  churchId: string; // 교회 id
  groupId: string;
};

type CreateGroupParams = {
  churchId: string; // 교회 id
};

type CreateGroupBody = {
  name: string;
  parentGroupId?: string;
};

type EditGroupParams = {
  churchId: string; // 교회 id
  groupId: string;
};

type EditGroupBody = {
  name: string;
  parentGroupId?: string;
};

type DeleteGroupParams = {
  churchId: string; // 교회 id
  groupId: string;
};

export class GroupsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? "http://localhost:3001" // 실제 사용할 url
      : "http://localhost:3001"; // 개발용 url
  }

  /**
   * 소그룹 불러오기
   * @param {GetGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroups = async (
    params: GetGroupsParams,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/groups`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 자식 소그룹 불러오기
   * @param {GetChildGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChildGroups = async (
    params: GetChildGroupsParams,
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/settings/groups/${groupId}/childGroups`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 소그룹 만들기
   * @param {CreateGroupParams} params
   * @param {CreateGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createGroups = async (
    params: CreateGroupParams,
    body: CreateGroupBody,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/settings/groups`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 소그룹 수정하기
   * @param {EditGroupParams} params
   * @param {EditGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroup = async (
    params: EditGroupParams,
    body: EditGroupBody,
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/settings/groups/${groupId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 소그룹 삭제하기
   * @param {DeleteGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroup = async (
    params: DeleteGroupParams,
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/settings/groups/${groupId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
