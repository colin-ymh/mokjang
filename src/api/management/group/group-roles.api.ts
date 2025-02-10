import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';

type GetGroupRolesParams = {
  churchId: string;
  groupId: string;
};

type CreateEveryGroupRoleParams = {
  churchId: string;
};

type CreateEveryGroupRolesBody = {
  role: string;
};

type CreateSingleGroupRoleParams = {
  churchId: string;
  groupId: string;
};

type CreateSingleGroupRolesBody = {
  role: string;
};

type EditGroupRoleParams = {
  churchId: string;
  groupId: string;
  roleId: string;
};

type EditGroupRoleBody = {
  role: string;
};

type DeleteGroupRoleParams = {
  churchId: string;
  groupId: string;
  roleId: string;
};

export class GroupRolesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 그룹의 역할들 불러오기
   * @param {GetGroupRolesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroupRoles = async (
    params: GetGroupRolesParams
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/role`;

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

  /**
   * 전체 역할 만들기
   * @param {CreateEveryGroupRoleParams} params
   * @param {CreateEveryGroupRolesBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEveryGroupRole = async (
    params: CreateEveryGroupRoleParams,
    body: CreateEveryGroupRolesBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/roles`;

    try {
      return await axios.post(url, body);
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
   * 특정 그룹에 역할 만들기
   * @param {CreateSingleGroupRoleParams} params
   * @param {CreateSingleGroupRolesBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createSingleGroupRole = async (
    params: CreateSingleGroupRoleParams,
    body: CreateSingleGroupRolesBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/role`;

    try {
      return await axios.post(url, body);
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
   * 역할 수정하기
   * @param {EditGroupRoleParams} params
   * @param {EditGroupRoleBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupRole = async (
    params: EditGroupRoleParams,
    body: EditGroupRoleBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId, roleId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/role/${roleId}`;

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
   * 역할 삭제하기
   * @param {DeleteGroupRoleParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupRole = async (
    params: DeleteGroupRoleParams
  ): Promise<AxiosResponse> => {
    const { churchId, groupId, roleId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/role/${roleId}`;

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
