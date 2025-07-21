import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import qs from 'qs';
import authorizeAxios from '@/api/authorize-axios';

type GetMinistryGroupMembersSearchParams = {
  churchId: string;
  take?: number;
  page?: number;
  orderDirection?: ORDER_DIRECTION;
  ministryGroupId?: string;
  name: string;
};

type GetMinistryGroupMembersParams = {
  churchId: string;
  take?: number;
  page?: number;
  orderDirection?: ORDER_DIRECTION;
  ministryGroupId: string;
};

type CreateMemberMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type CreateMemberMinistryGroupBody = {
  members: {
    memberId: string;
    ministryId?: string;
  }[];
};

type DeleteMemberMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type DeleteMemberMinistryGroupBody = {
  memberIds: string[];
};

export class MinistryGroupMembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역그룹을 위한 교인 검색
   * @param {GetMinistryGroupMembersSearchParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroupMembersSearch = async (
    params: GetMinistryGroupMembersSearchParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 30,
      page = 1,
      orderDirection,
      ministryGroupId,
      name,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        name,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/member-search`;

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
   * 사역 그룹 내 교인 조회
   * @param {GetMinistryGroupMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroupMembers = async (
    params: GetMinistryGroupMembersParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 30,
      page = 1,
      orderDirection,
      ministryGroupId,
    } = params;

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

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/members`;

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
   * 사역그룹에 교인 추가
   * @param {CreateMemberMinistryGroupParams} params
   * @param {CreateMemberMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMemberMinistryGroup = async (
    params: CreateMemberMinistryGroupParams,
    body: CreateMemberMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/members`;

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
   * 사역그룹에 교인 삭제
   * @param {DeleteMemberMinistryGroupParams} params
   * @param {DeleteMemberMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMemberMinistryGroup = async (
    params: DeleteMemberMinistryGroupParams,
    body: DeleteMemberMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/members`;

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
