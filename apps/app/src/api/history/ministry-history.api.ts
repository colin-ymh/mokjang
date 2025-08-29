import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '../../constants/state/url';
import { ORDER_DIRECTION } from '../../constants/constant';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';

type GetMinistryGroupHistoryParams = {
  churchId: string;
  memberId: string;
  take?: number;
  page?: number;
  orderDirection?: ORDER_DIRECTION;
};

type GetCurrentMinistryGroupHistoryParams = {
  churchId: string;
  memberId: string;
  limit?: number;
  cursor?: string;
  sortDirection?: ORDER_DIRECTION;
};

type EditMinistryGroupHistoryParams = {
  churchId: string;
  memberId: string;
  ministryGroupHistoryId: string;
};

type EditMinistryGroupHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type DeleteMinistryGroupHistoryParams = {
  churchId: string;
  memberId: string;
  ministryGroupHistoryId: string;
};

type GetMinistryDetailHistoryParams = {
  churchId: string;
  memberId: string;
  ministryGroupHistoryId: string;
  take?: number;
  page?: number;
  orderDirection?: ORDER_DIRECTION;
};

type EditMinistryDetailHistoryParams = {
  churchId: string;
  memberId: string;
  ministryGroupHistoryId: string;
  detailHistoryId: string;
};

type EditMinistryDetailHistoryBody = {
  startDate?: string;
  endDate?: string;
};

type DeleteMinistryDetailHistoryParams = {
  churchId: string;
  memberId: string;
  ministryGroupHistoryId: string;
  detailHistoryId: string;
};

export class MinistryHistoryApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 이력 조회
   * @param {GetMinistryGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryGroupHistory = async (
    params: GetMinistryGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, orderDirection, take, page } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          orderDirection,
          take,
          page,
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
   * 현재 사역 이력 조회
   * @param {GetCurrentMinistryGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getCurrentMinistryGroupHistory = async (
    params: GetCurrentMinistryGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, sortDirection, limit, cursor } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/current`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          sortDirection,
          limit,
          cursor,
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
   * 사역 이력 수정
   * @param {EditMinistryGroupHistoryParams} params
   * @param {EditMinistryGroupHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryGroupHistory = async (
    params: EditMinistryGroupHistoryParams,
    body: EditMinistryGroupHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryGroupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/${ministryGroupHistoryId}`;

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
   * 사역 종료
   * @param {DeleteMinistryGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryGroupHistory = async (
    params: DeleteMinistryGroupHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryGroupHistoryId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/${ministryGroupHistoryId}`;

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
   * 사역 이력 조회
   * @param {GetMinistryGroupHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMinistryDetailHistory = async (
    params: GetMinistryDetailHistoryParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      memberId,
      orderDirection,
      take,
      page,
      ministryGroupHistoryId,
    } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/${ministryGroupHistoryId}/details`;

    try {
      return await authorizeAxios.get(url, {
        params: {
          orderDirection,
          take,
          page,
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
   * 사역 이력 수정
   * @param {EditMinistryDetailHistoryParams} params
   * @param {EditMinistryDetailHistoryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMinistryDetailHistory = async (
    params: EditMinistryDetailHistoryParams,
    body: EditMinistryDetailHistoryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryGroupHistoryId, detailHistoryId } =
      params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/${ministryGroupHistoryId}/details/${detailHistoryId}`;

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
   * 사역 종료
   * @param {DeleteMinistryDetailHistoryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMinistryDetailHistory = async (
    params: DeleteMinistryDetailHistoryParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, ministryGroupHistoryId, detailHistoryId } =
      params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/histories/ministry-groups/${ministryGroupHistoryId}/details/${detailHistoryId}`;

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
