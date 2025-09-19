import { AxiosResponse } from 'axios';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

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
  pastor?: string;
};

type deleteChurchParams = {
  churchId: string;
};

export class ChurchesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
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

  /**
   *
   * @param {editChurchParams} params
   * @param {editChurchBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editChurch = async (
    params: editChurchParams,
    body: editChurchBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;
    const url = `${this._url}/churches/${churchId}`;

    try {
      return await authorizeAxios.patch(url.toString(), body);
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
