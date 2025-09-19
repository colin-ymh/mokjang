import { AxiosResponse } from 'axios';

import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';
import { EDUCATION_ATTENDANCE_STATUS } from '@mokjang/constants';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

type GetEducationAttendancesParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
  page?: number;
  take?: number;
};

type EditEducationAttendanceParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
  attendanceId: string;
};

type EditEducationAttendanceBody = {
  status?: EDUCATION_ATTENDANCE_STATUS;
};

type EditEducationAttendanceNoteParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
  attendanceId: string;
};

type EditEducationAttendanceNoteBody = {
  note: string;
};

type PatchAllAttendedParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
};

export class EducationAttendanceApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 기수 불러오기
   * @param {GetEducationAttendancesParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationAttendances = async (
    params: GetEducationAttendancesParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, sessionId, page, take } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance`;

    try {
      return await authorizeAxios.get(url, {
        params: { page, take },
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
   * 교육 출석 여부 개별 수정하기
   * @param {PatchAllAttendedParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public patchAllAttended = async (
    params: PatchAllAttendedParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance/all-attended`;

    try {
      return await authorizeAxios.patch(url);
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
   * 교육 출석 여부 개별 수정하기
   * @param {EditEducationAttendanceParams} params
   * @param {EditEducationAttendanceBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationAttendance = async (
    params: EditEducationAttendanceParams,
    body: EditEducationAttendanceBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, sessionId, attendanceId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance/${attendanceId}/attendance`;

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
   * 교육 출석 특이사항 수정하기
   * @param {EditEducationAttendanceNoteParams} params
   * @param {EditEducationAttendanceNoteBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationAttendanceNote = async (
    params: EditEducationAttendanceNoteParams,
    body: EditEducationAttendanceNoteBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, sessionId, attendanceId } =
      params;

    const url = `${this._url}/churches/${churchId}/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance/${attendanceId}/note`;

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
