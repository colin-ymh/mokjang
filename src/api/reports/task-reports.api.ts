import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import { TASK } from '@/constants/column/task-column';
import { TASK_STATUS } from '@/constants/status/status';

type GetTaskReportsParams = {
  churchId: string;
  memberId: string;
  take?: number;
  page?: number;
  order?: TASK;
  orderDirection?: ORDER_DIRECTION;

  fromStartDate?: string;
  toStartDate?: string;
  status?: TASK_STATUS[];
  taskTitle?: string;
  inChargeId?: string;
};

type GetTaskReportParams = {
  churchId: string;
  memberId: string;
  taskReportId: string;
};

type EditTaskParams = {
  churchId: string;
  memberId: string;
  taskReportId: string;
};

type EditTaskBody = {
  isRead?: boolean;
  isConfirmed?: boolean;
};

type DeleteTaskParams = {
  churchId: string;
  memberId: string;
  taskReportId: string;
};

export class TaskReportsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 심방 보고들 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getTaskReports = async (
    params: GetTaskReportsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      memberId,
      take = 5,
      page = 1,
      order,
      orderDirection,

      // fromStartDate,
      // toStartDate,
      // status,
      // taskMethod,
      // taskType,
      // taskTitle,
      // inChargeId,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        // fromStartDate,
        // toStartDate,
        // status,
        // taskTitle,
        // inChargeId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          // value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/tasks`;

    try {
      /* ③axios 호출 + qs 직렬화 --------------------------------------- */
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          }),
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

  public getTaskReport = async (params: GetTaskReportParams) => {
    const { churchId, taskReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/tasks/${taskReportId}`;

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

  public editTask = async (params: EditTaskParams, body: EditTaskBody) => {
    const { churchId, taskReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/tasks/${taskReportId}`;

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

  public deleteTask = async (params: DeleteTaskParams) => {
    const { churchId, taskReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/tasks/${taskReportId}`;

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
