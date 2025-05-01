import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';

enum GROUP_ORDER {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

type GetGroupsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: GROUP_ORDER;
  orderDirection?: ORDER_DIRECTION;
  parentGroupId?: string;
};

type GetGroupParams = {
  churchId: string;
  groupId: string;
};

type GetChildGroupsParams = {
  churchId: string;
  groupId: string;
};

type CreateGroupParams = {
  churchId: string;
};

type CreateGroupBody = {
  name: string;
  parentGroupId?: string | null;
};

type EditGroupParams = {
  churchId: string;
  groupId: string;
};

type EditGroupBody = {
  name?: string;
  parentGroupId?: string | null;
};

type DeleteGroupParams = {
  churchId: string;
  groupId: string;
};

export class GroupsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회의 소그룹들 불러오기
   * @param {GetGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroups = async (
    params: GetGroupsParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups`;

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
   * 특정 소그룹 불러오기
   * @param {GetGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroup = async (params: GetGroupParams): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}`;

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
   * 자식 소그룹 불러오기
   * @param {GetChildGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChildGroups = async (
    params: GetChildGroupsParams
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/childGroups`;

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
   * 소그룹 만들기
   * @param {CreateGroupParams} params
   * @param {CreateGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createGroup = async (
    params: CreateGroupParams,
    body: CreateGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups`;

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
   * 소그룹 수정하기
   * @param {EditGroupParams} params
   * @param {EditGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroup = async (
    params: EditGroupParams,
    body: EditGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}`;

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
   * 소그룹 삭제하기
   * @param {DeleteGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroup = async (
    params: DeleteGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}`;

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
