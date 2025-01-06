import axios, { AxiosResponse } from 'axios';
import { EditMemberBody } from '@/api/churches/members.api';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';

class HTTPError extends Error {}

type EditMemberOfficerParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type EditMemberOfficerBody = {
  isDeleteOfficer?: boolean;
  officerId?: string;
  officerStartDate?: string;
  officerStartChurch?: string;
};

type EditMemberMinistryParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type EditMemberMinistryBody = {
  isDeleteMinistry?: boolean;
  ministryId?: string;
};

type EditMemberEducationParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type EditMemberEducationBody = {
  isDeleteEducation?: boolean;
  educationId?: string;
};

type EditMemberGroupParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type EditMemberGroupBody = {
  isDeleteGroup?: boolean;
  groupId?: string;
};

export class MemberSettingsApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 직분 수정 / 삭제
   * @param {EditMemberOfficerParams} params
   * @param {EditMemberOfficerBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMemberOfficer = async (
    params: EditMemberOfficerParams,
    body: EditMemberOfficerBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/settings/officers`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 사역 수정 / 삭제
   * @param {EditMemberMinistryParams} params
   * @param {EditMemberMinistryBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMemberMinistry = async (
    params: EditMemberMinistryParams,
    body: EditMemberMinistryBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/settings/ministries`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교육이수 수정 / 삭제
   * @param {EditMemberEducationParams} params
   * @param {EditMemberEducationBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMemberEducation = async (
    params: EditMemberEducationParams,
    body: EditMemberEducationBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/settings/educations`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 소그룹 수정 / 삭제
   * @param {EditMemberGroupParams} params
   * @param {EditMemberGroupBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editMemberGroup = async (
    params: EditMemberGroupParams,
    body: EditMemberGroupBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/settings/groups`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
