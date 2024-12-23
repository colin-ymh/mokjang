import axios, { AxiosResponse } from "axios";
import { EditMemberBody } from "@/api/churches/members.api";
import { FAMILY } from "@/constants/constant";
import { SERVER_URL, TEST_SERVER_URL } from "@/constants/state/url";

class HTTPError extends Error {}

type GetFamilyParams = {
  churchId: string;
  memberId: string;
};

type CreateFamilyParams = {
  churchId: string;
  memberId: string;
};

type CreateFamilyBody = {
  familyMemberId: string;
  relation: FAMILY;
};

type EditFamilyParams = {
  churchId: string;
  memberId: string;
  familyMemberId: string;
};

type EditFamilyBody = {
  relation: FAMILY;
};

type DeleteFamilyParams = {
  churchId: string;
  memberId: string;
  familyMemberId: string;
};

export class FamilyApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   *가족 불러오기
   * @param {GetFamilyParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getFamily = async (
    params: GetFamilyParams,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/family`;

    try {
      return await axios.get(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   *가족 만들기
   * @param {CreateFamilyParams} params
   * @param {CreateFamilyBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public createFamily = async (
    params: CreateFamilyParams,
    body: CreateFamilyBody,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/family/fetch-family`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 가족 수정하기
   * @param {EditFamilyParams} params
   * @param {EditFamilyBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public editFamily = async (
    params: EditFamilyParams,
    body: EditFamilyBody,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, familyMemberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/family/${familyMemberId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   *가족 삭제하기
   * @param {DeleteFamilyParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public deleteFamily = async (
    params: DeleteFamilyParams,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, familyMemberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/family/${familyMemberId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
