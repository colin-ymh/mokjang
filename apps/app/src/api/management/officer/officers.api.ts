import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { CustomError } from '../../error/error';
import { ORDER_DIRECTION } from '@mokjang/constants';
import qs from 'qs';
import authorizeAxios from '../../authorize-axios';

export enum OFFICER_ORDER {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

type GetOfficersParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: OFFICER_ORDER;
  orderDirection?: ORDER_DIRECTION;
};

type CreateOfficerParams = {
  churchId: string;
};

type GetOfficerUnassignedMembersParams = {
  churchId: string;
  take?: number;
  page?: number;
  orderDirection?: ORDER_DIRECTION;
};

type CreateOfficerBody = {
  name: string;
};

type EditOfficerNameParams = {
  churchId: string;
  officerId: string;
};

type EditOfficerNameBody = {
  name: string;
};

type EditOfficerStructureParams = {
  churchId: string;
  officerId: string;
};

type EditOfficerStructureBody = {
  order: number;
};

type DeleteOfficerParams = {
  churchId: string;
  officerId: string;
};

export class OfficersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 직분 불러오기
   * @param {GetOfficersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOfficers = async (
    params: GetOfficersParams
  ): Promise<AxiosResponse> => {
    const { churchId, take = 5, page = 1, order, orderDirection } = params;

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

    const url = `${this._url}/churches/${churchId}/management/officers`;

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
   * 직분을 가지지 않은 교인 불러오기
   * @param {GetOfficerUnassignedMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOfficerUnassignedMembers = async (
    params: GetOfficerUnassignedMembersParams
  ): Promise<AxiosResponse> => {
    const { churchId, take = 5, page = 1, orderDirection } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/officers/unassigned-member`;

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
   * 직분 만들기
   * @param {CreateOfficerParams} params
   * @param {CreateOfficerBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createOfficer = async (
    params: CreateOfficerParams,
    body: CreateOfficerBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers`;

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
   * 직분명 수정하기
   * @param {EditOfficerNameParams} params
   * @param {EditOfficerNameBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editOfficerName = async (
    params: EditOfficerNameParams,
    body: EditOfficerNameBody
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}/name`;

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
   * 직분 구조 수정하기
   * @param {EditOfficerStructureParams} params
   * @param {EditOfficerStructureBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editOfficerStructure = async (
    params: EditOfficerStructureParams,
    body: EditOfficerStructureBody
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}/structure`;

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
   * @param {DeleteOfficerParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteOfficer = async (
    params: DeleteOfficerParams
  ): Promise<AxiosResponse> => {
    const { churchId, officerId } = params;

    const url = `${this._url}/churches/${churchId}/management/officers/${officerId}`;

    try {
      return await authorizeAxios.delete(url);
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
