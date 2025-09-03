import { AxiosResponse } from 'axios';
import { EditMemberBody } from './members.api';
import { SERVER_URL, TEST_SERVER_URL } from '../../constants/state/url';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';

type InviteMemberParams = {
  churchId: string; // 교회 id
  isTest?: boolean;
};

type InviteMemberBody = {
  name: string;
  mobilePhone: string;
  guidedById?: string;
  familyMemberId?: string;
};

type RequestValidationParams = {
  churchId: string; // 교회 id
  requestInfoId: string;
};

type RequestValidationBody = {
  name: string;
  mobilePhone: string;
};

type EditRequestInfoParams = {
  churchId: string; // 교회 id
  requestInfoId: string;
};

type EditRequestInfoBody = EditMemberBody & {
  name: string;
  mobilePhone: string;
};

export class RequestInfoApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교인 초대하기
   * @param {InviteMemberParams} params
   * @param {InviteMemberBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public inviteMember = async (
    params: InviteMemberParams,
    body: InviteMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, isTest = true } = params;

    const url = `${this._url}/churches/${churchId}/request?isTest=${isTest}`;

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
   * 새신자 측에서 이름과 전화번호를 통해 본인을 인증
   * @param {RequestValidationParams} params
   * @param {RequestValidationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public getRequestValidation = async (
    params: RequestValidationParams,
    body: RequestValidationBody
  ): Promise<AxiosResponse> => {
    const { churchId, requestInfoId } = params;

    const url = `${this._url}/churches/${churchId}/request/${requestInfoId}/validation`;

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
   * 새신자 측에서 본인의 정보를 업데이트
   * @param {EditRequestInfoParams} params
   * @param {EditMemberBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editRequestInfo = async (
    params: EditRequestInfoParams,
    body: EditRequestInfoBody
  ): Promise<AxiosResponse> => {
    const { churchId, requestInfoId } = params;

    const url = `${this._url}/churches/${churchId}/request/${requestInfoId}/submit`;

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
}
