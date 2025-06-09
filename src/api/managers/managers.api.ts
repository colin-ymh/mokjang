import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import { ORDER_DIRECTION } from '@/constants/constant';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';

type GetManagersParams = {
  churchId: string; // 교회 id
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: string;
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  name: string;
};

type GetManagerParams = {
  churchId: string; // 교회 id
  managerId: string;
};

type TogglePermissionActivityParams = {
  churchId: string;
  managerId: string;
};

type AssignPermissionTemplateParams = {
  churchId: string;
  managerId: string;
};

type AssignPermissionTemplateBody = {
  permissionTemplateId: string;
};

type UnassignPermissionTemplateParams = {
  churchId: string;
  managerId: string;
};

export class ManagersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 관리자 조회
   * @param {GetManagersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getManagers = async (
    params: GetManagersParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      order,
      orderDirection,
      name,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        name,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/managers`;

    try {
      return await axios.get(url, {
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
   * 관리자 단건 조회
   * @param  {GetManagerParams} params
   * @returns
   */
  public getManager = async (
    params: GetManagerParams
  ): Promise<AxiosResponse> => {
    const { churchId, managerId } = params;

    const url = `${this._url}/churches/${churchId}/managers/${managerId}`;

    try {
      return await axios.patch(url);
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
   * 관리자 활성 상태 온오프
   * @param  {TogglePermissionActivityParams} params
   * @returns
   */
  public togglePermissionActivity = async (
    params: TogglePermissionActivityParams
  ): Promise<AxiosResponse> => {
    const { churchId, managerId } = params;

    const url = `${this._url}/churches/${churchId}/managers/${managerId}/toggle-permission-activity`;

    try {
      return await axios.patch(url);
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
   * 권한 유형 부여
   * @param  {AssignPermissionTemplateParams} params
   * @param  {AssignPermissionTemplateBody} body
   * @returns
   */
  public assignPermissionTemplate = async (
    params: AssignPermissionTemplateParams,
    body: AssignPermissionTemplateBody
  ): Promise<AxiosResponse> => {
    const { churchId, managerId } = params;

    const url = `${this._url}/churches/${churchId}/managers/${managerId}/assign-permission-template`;

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

  /**
   * 권한 유형 해제
   * @param  {UnassignPermissionTemplateParams} params
   * @returns
   */
  public unassignPermissionTemplateChurch = async (
    params: UnassignPermissionTemplateParams
  ): Promise<AxiosResponse> => {
    const { churchId, managerId } = params;

    const url = `${this._url}/churches/${churchId}/managers/${managerId}/unassign-permission-template`;

    try {
      return await axios.patch(url);
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
