import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import qs from 'qs';
import authorizeAxios from '@/api/authorize-axios';

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

type CreateGroupParams = {
  churchId: string;
};

type CreateGroupBody = {
  name: string;
  parentGroupId?: string | null;
};

type EditGroupNameParams = {
  churchId: string;
  groupId: string;
};

type EditGroupNameBody = {
  name?: string;
};

type EditGroupStructureParams = {
  churchId: string;
  groupId: string;
};

type EditGroupStructureBody = {
  parentGroupId?: string | null;
  order?: number;
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
    const {
      churchId,
      take = 30,
      page = 1,
      order,
      orderDirection,
      parentGroupId,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        parentGroupId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/groups`;

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
   * 특정 소그룹 불러오기
   * @param {GetGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroup = async (params: GetGroupParams): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}`;

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
   * 그룹 이름 수정하기
   * @param {EditGroupNameParams} params
   * @param {EditGroupNameBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupName = async (
    params: EditGroupNameParams,
    body: EditGroupNameBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/name`;

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
   * 그룹 구조 수정하기
   * @param {EditGroupStructureParams} params
   * @param {EditGroupStructureBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editGroupStructure = async (
    params: EditGroupStructureParams,
    body: EditGroupStructureBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/structure`;

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
