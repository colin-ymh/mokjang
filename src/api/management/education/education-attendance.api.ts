import axios, { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

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
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
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
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
