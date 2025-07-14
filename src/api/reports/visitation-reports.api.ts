import { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import { VISITATION } from '@/constants/column/visitation-column';

type GetVisitationReportsParams = {
  churchId: string;
  memberId: string;
  take?: number;
  page?: number;
  order?: VISITATION;
  orderDirection?: ORDER_DIRECTION;

  // fromVisitationDate?: string;
  // toVisitationDate?: string;
  // visitationStatus?: VISITATION_STATUS[];
  // visitationMethod?: VISITATION_METHOD[];
  // visitationType?: VISITATION_TYPE[];
  // visitationTitle?: string;
  // instructorId?: string;
};

type GetVisitationReportParams = {
  churchId: string;
  memberId: string;
  visitationReportId: string;
};

type EditVisitationParams = {
  churchId: string;
  memberId: string;
  visitationReportId: string;
};

type EditVisitationBody = {
  isRead?: boolean;
  isConfirmed?: boolean;
};

type DeleteVisitationParams = {
  churchId: string;
  memberId: string;
  visitationReportId: string;
};

export class VisitationReportsApi {
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
  public getVisitationReports = async (
    params: GetVisitationReportsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      memberId,
      take = 5,
      page = 1,
      order,
      orderDirection,

      // fromVisitationDate,
      // toVisitationDate,
      // visitationStatus,
      // visitationMethod,
      // visitationType,
      // visitationTitle,
      // instructorId,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        // fromVisitationDate,
        // toVisitationDate,
        // visitationStatus,
        // visitationMethod,
        // visitationType,
        // visitationTitle,
        // instructorId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          // value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/visitations`;

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

  public getVisitationReport = async (params: GetVisitationReportParams) => {
    const { churchId, visitationReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/visitations/${visitationReportId}`;

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

  public editVisitation = async (
    params: EditVisitationParams,
    body: EditVisitationBody
  ) => {
    const { churchId, visitationReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/visitations/${visitationReportId}`;

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

  public deleteVisitation = async (params: DeleteVisitationParams) => {
    const { churchId, visitationReportId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/reports/visitations/${visitationReportId}`;

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
