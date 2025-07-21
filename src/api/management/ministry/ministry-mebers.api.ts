import { AxiosResponse } from 'axios';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';
import authorizeAxios from '@/api/authorize-axios';

type EditMemberMinistryParams = {
  churchId: string;
  ministryGroupId: string;
  ministryId: string;
};

type EditMemberMinistryBody = {
  memberId: string;
};

type DeleteMemberMinistryParams = {
  churchId: string;
  ministryGroupId: string;
  ministryId: string;
};

type DeleteMemberMinistryBody = {
  memberId: string;
};

export class MinistryMembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 사역 부여하기
   * @param {EditMemberMinistryParams} params
   * @param {EditMemberMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMemberMinistry = async (
    params: EditMemberMinistryParams,
    body: EditMemberMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries/${ministryId}/members`;

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
   * 사역 삭제하기
   * @param {DeleteMemberMinistryParams} params
   * @param {DeleteMemberMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public deleteMemberMinistry = async (
    params: DeleteMemberMinistryParams,
    body: DeleteMemberMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, ministryGroupId, ministryId } = params;

    const url = `${this._url}/churches/${churchId}/management/ministry-groups/${ministryGroupId}/ministries/${ministryId}/members`;

    try {
      return await authorizeAxios.delete(url, { data: body });
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
