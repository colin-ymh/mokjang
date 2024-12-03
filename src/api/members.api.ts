import axios, { AxiosResponse } from "axios";
import { TemporalMember } from "@/models/register/member-register";
import {
  BAPTISM,
  MARRIAGE,
  MEMBER_REGISTER_TYPE,
  OFFICER,
} from "@/constant/constant";

class HTTPError extends Error {}

type GetMembersParams = {
  churchId: number; // 교회 id
  name?: string; // 검색 이름
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
};

export type GetMembersResponse = TemporalMember & { id: string };

type GetMemberParams = {
  churchId: number; // 교회 id
  memberId: number;
};

type CreateMemberParams = {
  churchId: number;
};
export type CreateMemberBody = {
  // 필수입력값
  name?: string;
  mobilePhone?: string;
  // 그 외 정보
  profileImage?: string;
  birth?: string;
  isLunar?: boolean;
  gender?: string;
  address?: string;
  detailAddress?: string;
  homePhone?: string;
  family?: string;
  occupation?: string;
  school?: string;
  marriage?: MARRIAGE;
  detailMarriage?: string;
  baptism?: BAPTISM;
  guidedById?: string;
  previousChurchName?: string;
  vehicleNumber?: string[];
};

type EditMemberParams = {
  churchId: number;
  memberId: number;
};

type EditMemberBody = {
  name?: string;
  mobilePhone?: string;
  profileImage?: string;
  birth?: string;
  isLunar?: boolean;
  gender?: string;
  address?: string;
  detailAddress?: string;
  homePhone?: string;
  family?: string;
  occupation?: string;
  school?: string;
  marriage?: MARRIAGE;
  detailMarriage?: string;
  baptism?: BAPTISM;
  guidedById?: string;
  previousChurchName?: string;
  vehicleNumber?: string[];
};

type DeleteMemberParams = {
  churchId: number;
  memberId: number;
};

export class MembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? "http://localhost:3001" // 실제 사용할 url
      : "http://localhost:3001"; // 개발용 url
  }

  /**
   * 교인들 불러오기
   * @param {GetMembersParams} params
   * @returns {Promise<AxiosResponse>} {data, count}
   */
  public getMembers = async (
    params: GetMembersParams,
  ): Promise<AxiosResponse> => {
    const { churchId, take = 5, page = 1, name } = params;

    const queryParams: Record<string, any> = {
      take,
      page,
    };

    if (name) {
      queryParams.name = name.toString();
    }

    const url = `${this._url}/churches/${churchId}/members`;

    try {
      return await axios.get(url, { params: queryParams });
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교인 불러오기
   * @param {GetMemberParams} params
   * @returns
   */
  public getMember = async (
    params: GetMemberParams,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

    try {
      return await axios.post(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교인 생성하기
   * @param {CreateMemberParams} params
   * @param {CreateMemberBody} body
   * @returns
   */
  public createMember = async (
    params: CreateMemberParams,
    body: CreateMemberBody,
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/members`;

    try {
      return await axios.post(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교인 수정하기
   * @param  {EditMemberParams} params
   * @param  {EditMemberBody} body
   * @returns
   */
  public editMember = async (
    params: EditMemberParams,
    body: EditMemberBody,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

    try {
      return await axios.patch(url, body);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };

  /**
   * 교인 삭제하기
   * @param  {DeleteMemberParams} params
   * @returns
   */
  public deleteMember = async (
    params: DeleteMemberParams,
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

    try {
      return await axios.delete(url);
    } catch (error) {
      throw new HTTPError(`Fetch error: ${error}`);
    }
  };
}
