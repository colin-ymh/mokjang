import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';

type GetEducationAttendancesParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
};

type CreateEducationAttendancesParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
};

type EditEducationAttendanceParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  sessionId: string;
  attendanceId: string;
};

type EditEducationAttendanceBody = {
  isPresent?: boolean;
  note?: string;
  isDeleteNode?: boolean;
};

export class EducationAttendanceApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
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
    const { churchId, educationId, educationTermId, sessionId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance`;

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
   * 교육 기수 수정하기
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

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/sessions/${sessionId}/attendance/${attendanceId}`;

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
