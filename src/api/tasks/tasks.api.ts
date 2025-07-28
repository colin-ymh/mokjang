import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import { TASK } from '@/constants/column/task-column';
import { TASK_STATUS } from '@/constants/status/status';

type GetTasksParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: TASK;
  orderDirection?: ORDER_DIRECTION;

  fromStartDate?: string;
  toStartDate?: string;
  status?: TASK_STATUS[];
  title?: string;
  inChargeId?: string;
};

type CreateTaskParams = {
  churchId: string;
};

type CreateTaskBody = {
  status: TASK_STATUS;
  title: string;
  inChargeId: string;
  startDate: string;
  endDate: string;
  receiverIds?: string[];
  content: string;
};

type GetTaskParams = {
  churchId: string;
  taskId: string;
};

type EditTaskParams = {
  churchId: string;
  taskId: string;
};

type EditTaskBody = {
  status?: TASK_STATUS;
  title?: string;
  inChargeId?: string;
  startDate?: string;
  endDate?: string;
  parentTaskId?: string;
  receiverIds?: string[];
  content?: string;
};

type DeleteTaskParams = {
  churchId: string;
  taskId: string;
};

type EditTaskDetailsParams = {
  churchId: string;
  taskId: string;
  detailId: string;
};

type EditTaskDetailsBody = {
  taskContent?: string;
  taskPray?: string;
};

type AddReceiversParams = {
  churchId: string;
  taskId: string;
};

type AddReceiversBody = {
  receiverIds: string[];
};

type DeleteReceiversParams = {
  churchId: string;
  taskId: string;
};

type DeleteReceiversBody = {
  receiverIds: string[];
};

export class TasksApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 심방들 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getTasks = async (params: GetTasksParams): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      orderDirection,

      fromStartDate,
      toStartDate,
      status,
      inChargeId,
      title,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        fromStartDate,
        toStartDate,
        status,
        inChargeId,
        title,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/tasks`;

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

  public createTask = async (
    params: CreateTaskParams,
    body: CreateTaskBody
  ) => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/tasks`;

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

  public getTask = async (params: GetTaskParams) => {
    const { churchId, taskId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}`;

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
    const { churchId, taskId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}`;

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
    const { churchId, taskId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}`;

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

  public editTaskDetails = async (
    params: EditTaskDetailsParams,
    body: EditTaskDetailsBody
  ) => {
    const { churchId, taskId, detailId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}/details/${detailId}`;

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

  public addReceivers = async (
    params: AddReceiversParams,
    body: AddReceiversBody
  ) => {
    const { churchId, taskId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}/add-receivers`;

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

  public deleteReceivers = async (
    params: DeleteReceiversParams,
    body: DeleteReceiversBody
  ) => {
    const { churchId, taskId } = params;

    const url = `${this._url}/churches/${churchId}/tasks/${taskId}/delete-receivers`;

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
