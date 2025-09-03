import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import axios, { AxiosResponse } from 'axios';
import { CustomError } from './error';

type getErrorParams = {};

export class ErrorApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 에러 처리
   * @param {getError} params
   * @returns {Promise<AxiosResponse>}
   */
  public getError = async (params: getErrorParams): Promise<AxiosResponse> => {
    const url = `${this._url}/error/bad-request`;

    try {
      return await axios.get(url.toString());
    } catch (serverError: any) {
      if (serverError.response) {
        const { message, error, statusCode } = serverError.response.data;
        throw new CustomError(message, error, statusCode);
      } else {
        throw new CustomError(
          '알 수 없는 에러가 발생했습니다',
          500,
          'Unknown Error'
        );
      }
    }
  };
}
