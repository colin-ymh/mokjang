import { AxiosResponse } from 'axios';
import qs from 'qs';

import { ORDER_DIRECTION } from '@/constants/constant';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';
import { WORSHIP_ENROLLMENT } from '@/constants/column/worship-column';

type GetWorshipEnrollmentsParams = {
  churchId: string; // 교회 id
  worshipId: string;
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: WORSHIP_ENROLLMENT; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  groupId?: string;
  fromSessionDate?: string;
  toSessionDate?: string;
};

type RefreshWorshipEnrollmentsParams = {
  churchId: string;
  worshipId: string;
};

export class WorshipEnrollmentsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 예배 대상 조회
   * @param {GetWorshipEnrollmentsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getWorshipEnrollments = async (
    params: GetWorshipEnrollmentsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      worshipId,
      take = 5,
      page = 1,
      order,
      orderDirection,
      groupId,
      fromSessionDate,
      toSessionDate,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        groupId,
        fromSessionDate,
        toSessionDate,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/enrollments`;

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
   * 예배 대상 새로고침
   * @param  {RefreshWorshipEnrollmentsParams} params
   * @returns
   */
  public refreshWorshipEnrollments = async (
    params: RefreshWorshipEnrollmentsParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/refresh`;

    try {
      return await authorizeAxios.post(url);
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
