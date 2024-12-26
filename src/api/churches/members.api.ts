import axios, { AxiosResponse } from "axios";
import qs from "qs";

import {
  BAPTISM,
  GENDER,
  MARRIAGE,
  ORDER_DIRECTION,
} from "@/constants/constant";
import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";
import { SERVER_URL, TEST_SERVER_URL } from "@/constants/state/url";

class HTTPError extends Error {}

type GetMembersParams = {
  churchId: string; // 교회 id
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: MEMBER; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  // 컬럼 on/off
  isMobilePhone?: boolean;
  isBirth?: boolean;
  isGender?: boolean;
  isOfficer?: boolean;
  isMinistries?: boolean;
  isEducations?: boolean;
  isMarriage?: boolean;
  isAddress?: boolean;
  isHomePhone?: boolean;
  isOccupation?: boolean;
  isSchool?: boolean;
  isVehicleNumber?: boolean;
  // 필터링 내용
  name?: string; // 검색 이름
  mobilePhone?: string;
  birthAfter?: string;
  birthBefore?: string;
  createAfter?: string;
  createBefore?: string;
  school?: string;
  address?: string;
  homePhone?: string;
  occupation?: string;
  vehicleNumber?: string[];
  groupId?: string[];
  officeId?: string[];
  ministryId?: string[];
  educationId?: string[];
  baptism?: BAPTISM[];
  gender?: GENDER[];
  marriage?: MARRIAGE[];
};

export type GetMembersResponse = Member;

type GetMemberParams = {
  churchId: string; // 교회 id
  memberId: string;
};

type CreateMemberParams = {
  churchId: string;
};

export type CreateMemberBody = {
  name: string;
  mobilePhone: string;
  familyMemberId?: string;
  guidedById?: string;
  relation?: string;
};

type EditMemberParams = {
  churchId: string;
  memberId: string;
};

export type EditMemberBody = {
  profileImage?: string;
  birth?: string;
  isLunar?: boolean;
  gender?: string;
  address?: string;
  detailAddress?: string;
  homePhone?: string;
  familyMemberId?: string;
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
  churchId: string;
  memberId: string;
};

export class MembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 교인들 불러오기
   * @param {GetMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMembers = async (
    params: GetMembersParams,
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      take = 5,
      page = 1,
      order,
      orderDirection,
      name,
      mobilePhone,
      school,
      address,
      homePhone,
      occupation,
      vehicleNumber,
      birthAfter,
      birthBefore,
      createAfter,
      createBefore,
      gender,
      baptism,
      marriage,
      groupId,
      officeId,
      ministryId,
      educationId,
      isMobilePhone,
      isBirth,
      isGender,
      isOfficer,
      isMinistries,
      isEducations,
      isMarriage,
      isAddress,
      isHomePhone,
      isOccupation,
      isSchool,
      isVehicleNumber,
    } = params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        take,
        page,
        order,
        orderDirection,
        name,
        mobilePhone,
        school,
        address,
        homePhone,
        occupation,
        birthAfter,
        birthBefore,
        createAfter,
        createBefore,
        gender,
        baptism,
        marriage,
        groupId,
        officeId,
        ministryId,
        educationId,
        select__mobilePhone: isMobilePhone,
        select__birth: isBirth,
        select__gender: isGender,
        select__officer: isOfficer,
        select__ministries: isMinistries,
        select__educations: isEducations,
        select__marriage: isMarriage,
        select__address: isAddress,
        select__homePhone: isHomePhone,
        select__occupation: isOccupation,
        select__school: isSchool,
        select__vehicleNumber: isVehicleNumber,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0),
      ),
    );

    const url = `${this._url}/churches/${churchId}/members`;

    try {
      return await axios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: "repeat",
            skipNulls: true,
            encodeValuesOnly: true,
          });
        },
      });
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
      return await axios.get(url);
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
