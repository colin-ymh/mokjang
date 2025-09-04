import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@mokjang/constants';
import { ORDER_DIRECTION } from '@mokjang/constants';
import { CustomError } from '../../error/error';
import qs from 'qs';
import authorizeAxios from '../../authorize-axios';

export enum MINISTRY_ORDER {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

type GetMinistriesParams = {
  churchId: string;
  ministryGroupId: string;
  order?: MINISTRY_ORDER;
  orderDirection?: ORDER_DIRECTION;
  take?: number;
  page?: number;
};

type CreateMinistryParams = {
  churchId: string;
  ministryGroupId: string;
};

type CreateMinistryBody = {
  name: string;
};

type EditMinistryParams = {
  churchId: string;
  ministryGroupId: string;
  ministryId: string;
};

type EditMinistryBody = {
  name?: string;
};

type DeleteMinistryParams = {
  churchId: string;
  ministryGroupId: string;
  ministryId: string;
};

export class MinistriesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 불러오기
   * @param {GetMinistriesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistries = async (
    params: GetMinistriesParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 50,
      page = 1,
      order,
      orderDirection,
      ministryGroupId,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          // value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries`;

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
   * 사역 만들기
   * @param {CreateMinistryParams} params
   * @param {CreateMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createMinistry = async (
    params: CreateMinistryParams,
    body: CreateMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries`;

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
   * 사역 수정하기
   * @param {EditMinistryParams} params
   * @param {EditMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistry = async (
    params: EditMinistryParams,
    body: EditMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries/${ministryId}`;

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
   * 사역 삭제하기
   * @param {DeleteMinistryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistry = async (
    params: DeleteMinistryParams
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries/${ministryId}`;

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
