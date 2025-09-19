import { AxiosResponse } from 'axios';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

type EditUserNameBody = {
  name: string;
};

type RequestBody = {
  isTest: boolean;
  mobilePhone: string;
};

type VerifyBody = {
  inputCode: string;
};

export class UserApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 유저 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getUser = async (): Promise<AxiosResponse> => {
    const url = `${this._url}/me`;

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
   * 유저 이름 수정
   * @param {EditUserNameBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editUserName = async (
    body: EditUserNameBody
  ): Promise<AxiosResponse> => {
    const url = `${this._url}/users`;

    try {
      return await authorizeAxios.patch(url, body);
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
   * 유저 전화번호 변경 요청
   * @param {RequestBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public request = async (body: RequestBody): Promise<AxiosResponse> => {
    const url = `${this._url}/users/verification/request`;

    try {
      return await authorizeAxios.post(url, body);
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
   * 유저 전화번호 인증
   * @param {VerifyBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public verify = async (body: VerifyBody): Promise<AxiosResponse> => {
    const url = `${this._url}/users/verification/verify`;

    try {
      return await authorizeAxios.post(url, body);
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
   * 계정 탈퇴
   * @returns {Promise<AxiosResponse>}
   */
  public withdraw = async (): Promise<AxiosResponse> => {
    const url = `${this._url}/users`;

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
