import { AxiosResponse } from 'axios';
import qs from 'qs';

import {
  ORDER_DIRECTION,
  SERVER_URL,
  TEST_SERVER_URL,
  WORSHIP_ATTENDANCE,
} from '@mokjang/constants';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';
import { WORSHIP_ATTENDANCE_STATUS } from '@mokjang/models';

type GetWorshipAttendancesParams = {
  churchId: string; // 교회 id
  worshipId: string;
  sessionId: string;
  limit?: number;
  cursor?: string;
  sortBy?: WORSHIP_ATTENDANCE; // 정렬 기준
  sortDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  groupId?: string;
};

type RefreshWorshipAttendancesParams = {
  churchId: string;
  worshipId: string;
  sessionId: string;
};

type EditWorshipAttendanceParams = {
  churchId: string; // 교회 id
  worshipId: string;
  sessionId: string;
  attendanceId: string;
};

type EditWorshipAttendanceBody = {
  attendanceStatus?: WORSHIP_ATTENDANCE_STATUS;
  note?: string;
};

type PatchAllAttendedParam = {
  churchId: string;
  worshipId: string;
  sessionId: string;
};

type PatchAllAttendedBody = {
  groupId?: string;
};

export class WorshipAttendancesApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 출석 조회
   * @param {GetWorshipAttendancesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getWorshipAttendances = async (
    params: GetWorshipAttendancesParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      worshipId,
      sessionId,
      limit,
      cursor,
      sortBy,
      sortDirection,
      groupId,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        limit,
        cursor,
        sortBy,
        sortDirection,
        groupId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/v2`;

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
   * 출석 새로고침
   * @param  {RefreshWorshipAttendancesParams} params
   * @returns
   */
  public refreshWorshipAttendances = async (
    params: RefreshWorshipAttendancesParams
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/refresh`;

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

  /**
   * 출석 수정
   * @param  {EditWorshipAttendanceParams} params
   * @param  {EditWorshipAttendanceBody} body
   * @returns
   */
  public editWorshipAttendance = async (
    params: EditWorshipAttendanceParams,
    body: EditWorshipAttendanceBody
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId, attendanceId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/${attendanceId}`;

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
   * 일괄 출석
   * @param  {PatchAllAttendedParam} params
   * @param  {PatchAllAttendedBody} body
   * @returns
   */
  public patchAllAttended = async (
    params: PatchAllAttendedParam,
    body: PatchAllAttendedBody
  ): Promise<AxiosResponse> => {
    const { churchId, worshipId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/all-attended`;

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
