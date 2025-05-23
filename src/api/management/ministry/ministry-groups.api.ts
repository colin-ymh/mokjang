import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import qs from 'qs';

export enum MINISTRY_GROUP_ORDER {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

type GetMinistryGroupsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: MINISTRY_GROUP_ORDER;
  orderDirection?: ORDER_DIRECTION;
  parentMinistryGroupId?: string;
};

type CreateMinistryGroupParams = {
  churchId: string;
};

type CreateMinistryGroupBody = {
  name: string;
  parentMinistryGroupId: string | null;
};

type GetMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type EditMinistryGroupBody = {
  name?: string;
  parentMinistryGroupId?: string | null;
};

type DeleteMinistryGroupParams = {
  churchId: string;
  ministryGroupId: string;
};

type GetChildMinistryGroupsParams = {
  churchId: string;
  ministryGroupId: string;
};

export class MinistryGroupsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 그룹 불러오기
   * @param {GetMinistryGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroups = async (
    params: GetMinistryGroupsParams
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

    const url = `${this._url}/churches/${churchId}/management/ministry-groups`;

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
   * 사역 그룹 만들기
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
   * 특정 사역 그룹 불러오기
   * @param {GetMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroup = async (
    params: GetMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

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
   * 사역 그룹 수정하기
   * @param {EditMinistryGroupParams} params
   * @param {EditMinistryGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroup = async (
    params: EditMinistryGroupParams,
    body: EditMinistryGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

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
   * 사역 그룹 삭제하기
   * @param {DeleteMinistryGroupParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryGroup = async (
    params: DeleteMinistryGroupParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}`;

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

  /**
   * 자식 사역 그룹 불러오기
   * @param {GetChildMinistryGroupsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getChildMinistryGroups = async (
    params: GetChildMinistryGroupsParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/childGroups`;

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
}
