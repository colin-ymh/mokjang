import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';

class HTTPError extends Error {}

type GetGroupHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
};

type createGroupHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type createGroupHistoryBody = {
  groupId: string;
  startDate: string;
  groupRoleId?: string;
  endDate?: string;
  autoEndDate?: boolean;
};

type editGroupHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  groupHistoryId: string;
};

type editGroupHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type deleteGroupHistoryParams = {
  churchId: string; // 교회 id
  memberId: string;
  groupHistoryId: string;
};

export class GroupHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 그룹 이력 조회
   * @param {GetGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroupHistory = async (
    params: GetGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups`;

    try {
      return await axios.get(url, {
        params: {
          orderDirection,
        },
      });
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 그룹 이력 생성
   * @param {createGroupHistoryParams} params
   * @param {createGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createGroupHistory = async (
    params: createGroupHistoryParams,
    body: createGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 그룹 이력 수정
   * @param {createGroupHistoryParams} params
   * @param {createGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupHistory = async (
    params: editGroupHistoryParams,
    body: editGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups/${groupHistoryId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 그룹 이력 삭제
   * @param {createGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupHistory = async (
    params: deleteGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, groupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/groups/${groupHistoryId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
