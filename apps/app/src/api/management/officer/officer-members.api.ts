import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { CustomError } from '../../error/error';
import { ORDER_DIRECTION } from '@mokjang/constants';
import authorizeAxios from '../../authorize-axios';
import qs from 'qs';

export enum OFFICER_MEMBER_ORDER {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

type GetOfficerMembersParams = {
  churchId: string;
  officerId: string;
  take?: number;
  page?: number;
  order?: OFFICER_MEMBER_ORDER;
  orderDirection?: ORDER_DIRECTION;
};

type AddOfficerMemberParams = {
  churchId: string;
  officerId: string;
};

type AddOfficerMemberBody = {
  memberIds: string[];
  startDate: string;
};

type DeleteOfficerMemberParams = {
  churchId: string;
  officerId: string;
};

type DeleteOfficerMemberBody = {
  memberIds: string[];
  endDate: string;
};

export class OfficerMembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 직분 교인 불러오기
   * @param {GetOfficerMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOfficerMembers = async (
    params: GetOfficerMembersParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      officerId,
      take = 5,
      page = 1,
      order,
      orderDirection,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}/members`;

    try {
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          });
        },
      });
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
   * 교인에 직분 부여
   * @param {AddOfficerMemberParams} params
   * @param {AddOfficerMemberBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public addOfficerMember = async (
    params: AddOfficerMemberParams,
    body: AddOfficerMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}/members`;

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
   * 직분 삭제하기
   * @param {DeleteOfficerMemberParams} params
   * @param {DeleteOfficerMemberBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public deleteOfficerMember = async (
    params: DeleteOfficerMemberParams,
    body: DeleteOfficerMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}/members`;

    try {
      return await authorizeAxios.delete(url, { data: body });
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
