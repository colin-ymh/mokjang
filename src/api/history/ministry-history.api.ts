import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';

class HTTPError extends Error {}

type GetMinistryHistoryParams = {
  churchId: string;
  memberId: string;
  orderDirection?: ORDER_DIRECTION;
};

type createMinistryHistoryParams = {
  churchId: string;
  memberId: string;
};

type createMinistryHistoryBody = {
  ministryId: string;
  startDate?: string;
};

type stopMinistryHistoryParams = {
  churchId: string;
  memberId: string;
  ministryId: string;
};

type stopMinistryHistoryBody = {
  endDate?: string;
};

type editMinistryHistoryParams = {
  churchId: string;
  memberId: string;
  ministryHistoryId: string;
};

type editMinistryHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type deleteMinistryHistoryParams = {
  churchId: string;
  memberId: string;
  ministryHistoryId: string;
};

export class MinistryHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 이력 조회
   * @param {GetMinistryHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryHistory = async (
    params: GetMinistryHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/ministries`;

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
   * 사역 이력 생성
   * @param {createMinistryHistoryParams} params
   * @param {createMinistryHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMinistryHistory = async (
    params: createMinistryHistoryParams,
    body: createMinistryHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/ministries`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 종료
   * @param {stopMinistryHistoryParams} params
   * @param {stopMinistryHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public stopMinistryHistory = async (
    params: stopMinistryHistoryParams,
    body: stopMinistryHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/ministries/${ministryId}`;

    try {
      return await axios.delete(url, {
        data: body,
      });
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 이력 수정
   * @param {editMinistryHistoryParams} params
   * @param {editMinistryHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryHistory = async (
    params: editMinistryHistoryParams,
    body: editMinistryHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/ministries/${ministryHistoryId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 이력 삭제
   * @param {deleteMinistryHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryHistory = async (
    params: deleteMinistryHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/ministries/${ministryHistoryId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
