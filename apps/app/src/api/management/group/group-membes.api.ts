import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '../../../constants/state/url';
import { CustomError } from '../../error/error';
import { ORDER_DIRECTION } from '../../../constants/constant';
import authorizeAxios from '../../authorize-axios';
import qs from 'qs';

export enum GROUP_MEMBER_ORDER {
  OFFICER_NAME = 'officerName',
  NAME = 'name',
  REGISTERED_AT = 'registeredAt',
  BIRTH = 'birth',
  mobilePhone = 'mobilePhone',
}

type GetGroupMemberParams = {
  churchId: string;
  groupId: string;
  take: number;
  page: number;
  order?: GROUP_MEMBER_ORDER;
  orderDirection?: ORDER_DIRECTION;
};

type AddMemberGroupParams = {
  churchId: string;
  groupId: string;
};

type AddMemberGroupBody = {
  memberIds: string[];
  startDate: string;
};

type DeleteGroupMemberParams = {
  churchId: string;
  groupId: string;
};

type DeleteGroupMemberBody = {
  memberIds: string[];
  endDate: string;
};

export class GroupMembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 그룹 내 교인 조회
   * @param {GetGroupMemberParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getGroupMembers = async (
    params: GetGroupMemberParams
  ): Promise<AxiosResponse> => {
    const { churchId, groupId, take, page, order, orderDirection } = params;

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

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/members`;

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
   * 그룹에 교인 추가
   * @param {AddMemberGroupParams} params
   * @param {AddMemberGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public addGroupMember = async (
    params: AddMemberGroupParams,
    body: AddMemberGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/members`;

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
   * @param {DeleteGroupMemberParams} params
   * @param {DeleteGroupMemberBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public deleteGroupMember = async (
    params: DeleteGroupMemberParams,
    body: DeleteGroupMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, groupId } = params;

    const url = `${this._url}/churches/${churchId}/management/groups/${groupId}/members`;

    try {
      return await authorizeAxios.delete(url, {
        data: body,
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
}
