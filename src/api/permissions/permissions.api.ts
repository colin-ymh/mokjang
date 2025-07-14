import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import { PERMISSION_TEMPLATE } from '@/constants/column/permission-column';
import { DOMAIN } from '@/models/permission/permission';

type GetPermissionUnitsParams = {
  churchId: string;
  domain?: DOMAIN;
};

type GetPermissionTemplatesParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: PERMISSION_TEMPLATE;
  orderDirection?: ORDER_DIRECTION;
};

type CreatePermissionTemplateParams = {
  churchId: string;
};

type CreatePermissionTemplateBody = {
  title: string;
  unitIds: string[];
};

type GetPermissionTemplateParams = {
  churchId: string;
  templateId: string;
};

type EditPermissionTemplateParams = {
  churchId: string;
  templateId: string;
};

type EditPermissionTemplateBody = {
  title?: string;
  unitIds?: string[];
};

type DeletePermissionTemplateParams = {
  churchId: string;
  templateId: string;
};

type GetPermissionManagersParams = {
  churchId: string;
  templateId: string;
};

export class PermissionsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 권한 단위 조회
   * @returns {Promise<AxiosResponse>}
   */
  public getPermissionUnits = async (
    params: GetPermissionUnitsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      domain,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
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
   * 권한 유형 조회
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
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
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

  public createSamplePermissionTemplate = async (
    params: CreatePermissionTemplateParams
  ) => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/sample`;

    try {
      return await authorizeAxios.post(url);
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
    const { churchId, templateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${templateId}`;

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

  public editPermissionTemplate = async (
    params: EditPermissionTemplateParams,
    body: EditPermissionTemplateBody
  ) => {
    const { churchId, templateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${templateId}`;

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

  public deletePermissionTemplate = async (
    params: DeletePermissionTemplateParams
  ) => {
    const { churchId, templateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${templateId}`;

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

  public getPermissionManagers = async (
    params: GetPermissionTemplateParams
  ) => {
    const { churchId, templateId } = params;

    const url = `${this._url}/churches/${churchId}/permissions/templates/${templateId}/managers`;

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
}
