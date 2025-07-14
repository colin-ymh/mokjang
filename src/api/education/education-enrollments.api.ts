import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { ORDER_DIRECTION } from '@/constants/constant';
import { CustomError } from '@/api/error/error';
import { EDUCATION_ENROLLMENT } from '@/constants/column/education-column';
import authorizeAxios from '@/api/authorize-axios';
import { EDUCATION_ENROLLMENT_STATUS } from '@/constants/status/status';

type GetEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  take?: number;
  page?: number;
  order?: EDUCATION_ENROLLMENT;
  orderDirection?: ORDER_DIRECTION;
};

type CreateEducationEnrollmentsParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
};

type CreateEducationEnrollmentsBody = {
  memberId: string;
  status?: EDUCATION_ENROLLMENT_STATUS;
  note?: string;
};

type EditEducationEnrollmentParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationEnrollmentId: string;
};

type EditEducationEnrollmentBody = {
  status?: EDUCATION_ENROLLMENT_STATUS;
  note?: string;
  isDeleteNote?: boolean;
};

type DeleteEducationEnrollmentParams = {
  churchId: string;
  educationId: string;
  educationTermId: string;
  educationEnrollmentId: string;
};

export class EducationEnrollmentsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }
  /**
   * 교육 대상자 상태 불러오기
   * @param {GetEducationEnrollmentsParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getEducationEnrollments = async (
    params: GetEducationEnrollmentsParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/enrollments`;

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
   * 교육 대상자 상태 만들기
   * @param {CreateEducationEnrollmentsParams} params
   * @param {CreateEducationEnrollmentsBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createEducationEnrollments = async (
    params: CreateEducationEnrollmentsParams,
    body: CreateEducationEnrollmentsBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId } = params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/enrollments`;

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

  /**
   * 교육 대상자 상태 수정하기
   * @param {EditEducationEnrollmentParams} params
   * @param {EditEducationEnrollmentBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editEducationEnrollment = async (
    params: EditEducationEnrollmentParams,
    body: EditEducationEnrollmentBody
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationEnrollmentId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/enrollments/${educationEnrollmentId}`;

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
   * 교육 대상자 상태 삭제하기
   * @param {DeleteEducationEnrollmentParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteEducationEnrollment = async (
    params: DeleteEducationEnrollmentParams
  ): Promise<AxiosResponse> => {
    const { churchId, educationId, educationTermId, educationEnrollmentId } =
      params;

    const url = `${this._url}/churches/${churchId}/management/educations/${educationId}/terms/${educationTermId}/enrollments/${educationEnrollmentId}`;

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
