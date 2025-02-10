import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import axios, { AxiosResponse } from 'axios';

class HTTPError extends Error {}

type createDummyMembers = {
  churchId: string;
};

export class DummyApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교인 더미데이터 생성
   * @param {createDummyMembers} params
   * @returns {Promise<AxiosResponse>}
   */
  public createDummyMembers = async (
    params: createDummyMembers
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/dummy/${churchId}/members`;

    try {
      return await axios.post(url.toString());
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
