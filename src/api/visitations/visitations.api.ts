import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import authorizeAxios from '@/api/authorize-axios';
import { CustomError } from '@/api/error/error';
import { ORDER_DIRECTION } from '@/constants/constant';
import {
  VISITATION_METHOD,
  VISITATION_TYPE,
  VisitationDetail,
} from '@/models/visitation/visitation';
import { VISITATION } from '@/constants/visitation/visitation-column';
import { VISITATION_STATUS } from '@/constants/status/status';

type GetVisitationsParams = {
  churchId: string;
  take?: number;
  page?: number;
  order?: VISITATION;
  orderDirection?: ORDER_DIRECTION;

  fromVisitationDate?: string;
  toVisitationDate?: string;
  status?: VISITATION_STATUS[];
  visitationMethod?: VISITATION_METHOD[];
  visitationType?: VISITATION_TYPE[];
  title?: string;
  inChargeId?: string;
};

type CreateVisitationParams = {
  churchId: string;
};

type CreateVisitationBody = {
  status: VISITATION_STATUS;
  visitationMethod: VISITATION_METHOD;
  title: string;
  inChargeId: string;
  startDate: string;
  endDate: string;
  visitationDetails: VisitationDetail[];
  receiverIds?: string[];
};

type GetVisitationParams = {
  churchId: string;
  visitationId: string;
};

type EditVisitationParams = {
  churchId: string;
  visitationId: string;
};

type EditVisitationBody = {
  status?: VISITATION_STATUS;
  visitationMethod?: VISITATION_METHOD;
  title?: string;
  inChargeId?: string;
  startDate?: string;
  endDate?: string;
  addMemberIds?: string[];
  deleteMemberIds?: string[];
};

type DeleteVisitationParams = {
  churchId: string;
  visitationId: string;
};

type EditVisitationDetailsParams = {
  churchId: string;
  visitationId: string;
  detailId: string;
};

type EditVisitationDetailsBody = {
  visitationContent?: string;
  visitationPray?: string;
};

type AddReceiversParams = {
  churchId: string;
  visitationId: string;
};

type AddReceiversBody = {
  receiverIds: string[];
};

type DeleteReceiversParams = {
  churchId: string;
  visitationId: string;
};

type DeleteReceiversBody = {
  receiverIds: string[];
};

export class VisitationsApi {
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
  public getVisitations = async (
    params: GetVisitationsParams
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      orderDirection,

      fromVisitationDate,
      toVisitationDate,
      status,
      visitationMethod,
      visitationType,
      title,
      inChargeId,
      // 필요하다면 선택 컬럼 등 추가
    } = params;

    /* ①queryParams 구성 ─────────────────────────────────────────────── */
    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        orderDirection,
        fromVisitationDate,
        toVisitationDate,
        status,
        visitationMethod,
        visitationType,
        title,
        inChargeId,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    /* ②요청 URL ------------------------------------------------------- */
    const url = `${this._url}/churches/${churchId}/visitations`;

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

  public createVisitation = async (
    params: CreateVisitationParams,
    body: CreateVisitationBody
  ) => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/visitations`;

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

  public getVisitation = async (params: GetVisitationParams) => {
    const { churchId, visitationId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;

    try {
      return await axios.get(url);
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
    const { churchId, visitationId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;

    try {
      return await axios.patch(url, body);
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
    const { churchId, visitationId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;

    try {
      return await axios.delete(url);
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

  public editVisitationDetails = async (
    params: EditVisitationDetailsParams,
    body: EditVisitationDetailsBody
  ) => {
    const { churchId, visitationId, detailId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}/details/${detailId}`;

    try {
      return await axios.patch(url, body);
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
    const { churchId, visitationId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}/add-receivers`;

    try {
      return await axios.patch(url, body);
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
    const { churchId, visitationId } = params;

    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}/delete-receivers`;

    try {
      return await axios.patch(url, body);
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
