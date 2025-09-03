import {
  SERVER_URL,
  TEST_SERVER_URL,
} from '../../../../../packages/constants/src';
import authorizeAxios from '../authorize-axios';
import { CustomError } from '../error/error';

type CreateJoinRequestBody = {
  joinCode: string;
};

export class JoinApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회 가입 신청
   * @param {CreateJoinRequestBody} body
   */
  public createJoinRequest = async (body: CreateJoinRequestBody) => {
    const url = `${this._url}/churches/join`;

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
   * 교회 가입 신청 내역 조회
   */
  public getJoinRequests = async () => {
    const url = `${this._url}/users/church/join-request`;

    try {
      return await authorizeAxios.get(url);
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
   * 교회 가입 신청 삭제
   */
  public cancelJoinRequest = async () => {
    const url = `${this._url}/users/church/join-request/cancel`;

    try {
      return await authorizeAxios.patch(url);
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
