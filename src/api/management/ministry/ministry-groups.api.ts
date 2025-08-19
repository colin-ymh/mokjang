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

type GetMinistryGroupsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: GROUP_ORDER;
  orderDirection?: ORDER_DIRECTION;
  parentMinistryGroupId?: string;
};

type GetMinistryGroupUnassignedMembersParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: GROUP_ORDER;
  orderDirection?: ORDER_DIRECTION;
};

type GetMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type CreateMinistryGroupParams = {
  churchId: string;
};

type CreateMinistryGroupBody = {
  name: string;
  parentMinistryGroupId?: string | null;
};

type EditMinistryGroupNameParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupNameBody = {
  name?: string;
};

type EditMinistryGroupStructureParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupStructureBody = {
  parentMinistryGroupId?: string | null;
  order?: number;
};

type DeleteMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupLeaderParams = {
  ministryGroupId: string;
  churchId: string;
};

type EditMinistryGroupLeaderBody = {
  newMinistryGroupLeaderId: string;
  startDate: string;
};

export class MinistryGroupsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교회의 사역그룹들 불러오기
   * @param {GetMinistryGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroups = async (
    params: GetMinistryGroupsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 30,
      page = 1,
      order,
      orderDirection,
      parentMinistryGroupId,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        parentMinistryGroupId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/ministry-groups`;

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
   * 교회의 소그룹들 불러오기
   * @param {GetMinistryGroupUnassignedMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroupUnassignedMembers = async (
    params: GetMinistryGroupUnassignedMembersParams
  ): Promise<AxiosResponse> => {
    const { churchId, take = 30, page = 1, order, orderDirection } = params;

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

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/unassigned-member`;

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
   * 특정 사역그룹 불러오기
   * @param {GetMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroup = async (
    params: GetMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

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
   * 사역그룹 만들기
   * @param {CreateMinistryGroupParams} params
   * @param {CreateMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMinistryGroup = async (
    params: CreateMinistryGroupParams,
    body: CreateMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups`;

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
   * @param {EditMinistryGroupNameParams} params
   * @param {EditMinistryGroupNameBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroupName = async (
    params: EditMinistryGroupNameParams,
    body: EditMinistryGroupNameBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/name`;

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
   * @param {EditMinistryGroupStructureParams} params
   * @param {EditMinistryGroupStructureBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroupStructure = async (
    params: EditMinistryGroupStructureParams,
    body: EditMinistryGroupStructureBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/structure`;

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
   * 사역그룹 삭제하기
   * @param {DeleteMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryGroup = async (
    params: DeleteMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

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

  /**
   * 그룹장 수정하기
   * @param {EditMinistryGroupLeaderParams} params
   * @param {EditMinistryGroupLeaderBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroupLeader = async (
    params: EditMinistryGroupLeaderParams,
    body: EditMinistryGroupLeaderBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/leader`;

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
}
