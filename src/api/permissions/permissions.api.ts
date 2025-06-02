import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import { PERMISSION_TEMPLATE } from '@/constants/permission/permission-column';
import { DOMAIN } from '@/models/permission/permission';

type GetPermissionUnitsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: PERMISSION_TEMPLATE;
  orderDirection?: ORDER_DIRECTION;
  domain?: DOMAIN;
};

type GetPermissionTemplatesParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: PERMISSION_TEMPLATE;
  orderDirection?: ORDER_DIRECTION;

  fromStartDate?: string;
  toStartDate?: string;
  name?: string;
};

type CreatePermissionTemplateParams = {
  churchId: string;
};

type CreatePermissionTemplateBody = {
  name: string;
  unitIds: string[];
};

type GetPermissionTemplateParams = {
  churchId: string;
  permissionTemplateId: string;
};

type EditPermissionTemplateParams = {
  churchId: string;
  permissionTemplateId: string;
};

type EditPermissionTemplateBody = {
  name?: string;
  unitIds?: string[];
};

type DeletePermissionTemplateParams = {
  churchId: string;
  permissionTemplateId: string;
};

export class PermissionsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 권한유형들 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getPermissionUnits = async (
    params: GetPermissionUnitsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      orderDirection,
      domain,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        domain,
      }).filter(
        ([_, value]) =>
          value !== undefined && !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/permissions/units`;

    try {
      /* ③axios 호출 + qs 직렬화 --------------------------------------- */
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          }),
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
   * 권한유형들 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getPermissionTemplates = async (
    params: GetPermissionTemplatesParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      orderDirection,

      fromStartDate,
      toStartDate,
      name,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        fromStartDate,
        toStartDate,
        name,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/permissions/templates`;

    try {
      /* ③axios 호출 + qs 직렬화 --------------------------------------- */
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          }),
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

  public createPermissionTemplate = async (
    params: CreatePermissionTemplateParams,
    body: CreatePermissionTemplateBody
  ) => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates`;

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

  public getPermissionTemplate = async (
    params: GetPermissionTemplateParams
  ) => {
    const { churchId, permissionTemplateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${permissionTemplateId}`;

    try {
      return await axios.get(url);
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

  public editPermissionTemplate = async (
    params: EditPermissionTemplateParams,
    body: EditPermissionTemplateBody
  ) => {
    const { churchId, permissionTemplateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${permissionTemplateId}`;

    try {
      return await axios.patch(url, body);
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

  public deletePermissionTemplate = async (
    params: DeletePermissionTemplateParams
  ) => {
    const { churchId, permissionTemplateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${permissionTemplateId}`;

    try {
      return await axios.delete(url);
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
