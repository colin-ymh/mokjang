import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';
import { SEARCH_RANGE } from '@/constants/constant';

type GetNewMemberSummaryParams = {
  churchId: string;
};

type GetNewMemberDetailsParams = {
  churchId: string;
  periodStart: string;
};

type GetMySchedulesParams = {
  range: SEARCH_RANGE;
  churchId: string;
};

export class HomeApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 신규 등록자 요약 조회
   * @param {GetNewMemberSummaryParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getNewMemberSummary = async (
    params: GetNewMemberSummaryParams
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/home/members/new/summary?range=weekly`;

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
   * 신규 등록자 상세 조회
   * @param {GetNewMemberDetailsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getNewMemberDetails = async (
    params: GetNewMemberDetailsParams
  ): Promise<AxiosResponse> => {
    const { churchId, periodStart } = params;

    const url = `${this._url}/churches/${churchId}/home/members/new/details?range=weekly&take=50&periodStart=${periodStart}`;

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
   * 내가 담당한 일정 조회
   * @param {GetMySchedulesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMySchedules = async (
    params: GetMySchedulesParams
  ): Promise<AxiosResponse> => {
    const { churchId, range } = params;

    const url = `${this._url}/churches/${churchId}/home/schedules?range=${range}`;

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
}
