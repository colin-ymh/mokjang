import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import { BAPTISM, MARRIAGE, ORDER_DIRECTION } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { MEMBER } from '@/constants/member/member-column';
import { SERVER_URL, TEST_SERVER_URL } from '@/constants/state/url';
import { CustomError } from '@/api/error/error';

type GetMembersParams = {
  churchId: string; // 교회 id
  page?: number; // 페이지 번호
  take?: number; // 요청 개수
  order?: MEMBER; // 정렬 기준
  orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순

  // 필터링 내용
  name?: string; // 검색 이름
  mobilePhone?: string;
  birthAfter?: string;
  birthBefore?: string;
  registerAfter?: string;
  registerBefore?: string;
  updateAfter?: string;
  updateBefore?: string;
  school?: string;
  address?: string;
  homePhone?: string;
  occupation?: string;
  vehicleNumber?: string;
  group?: string[];
  officer?: string[];
  ministries?: string[];
  educations?: string[];
  baptism?: string[];
  gender?: string[];
  marriage?: string[];

  //   활성화된 컬럼들
  selectedColumns?: MEMBER[];
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
  previousChurch?: string;
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
    params: GetMembersParams
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
      registerAfter,
      registerBefore,
      updateAfter,
      updateBefore,
      gender,
      baptism,
      marriage,
      group,
      officer,
      ministries,
      educations,
      selectedColumns,
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
        registerAfter,
        registerBefore,
        updateAfter,
        updateBefore,
        gender,
        baptism,
        marriage,
        group,
        officer,
        ministries,
        educations,
        vehicleNumber,
        select__group: true,
        select__mobilePhone: selectedColumns?.includes(MEMBER.MOBILE_PHONE),
        select__birth:
          selectedColumns?.includes(MEMBER.BIRTH) ||
          selectedColumns?.includes(MEMBER.AGE),
        select__gender: selectedColumns?.includes(MEMBER.GENDER),
        select__officer: selectedColumns?.includes(MEMBER.OFFICER),
        select__ministries: selectedColumns?.includes(MEMBER.MINISTRIES),
        select__educations: selectedColumns?.includes(MEMBER.EDUCATIONS),
        select__marriage: selectedColumns?.includes(MEMBER.MARRIAGE),
        select__address: selectedColumns?.includes(MEMBER.ADDRESS),
        select__homePhone: selectedColumns?.includes(MEMBER.HOME_PHONE),
        select__occupation: selectedColumns?.includes(MEMBER.OCCUPATION),
        select__school: selectedColumns?.includes(MEMBER.SCHOOL),
        select__vehicleNumber: selectedColumns?.includes(MEMBER.VEHICLE_NUMBER),
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/members`;

    try {
      return await axios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          });
        },
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

  /**
   * 유저로 등록된 교인들 불러오기
   * @param {GetMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getUserMembers = async (
    params: GetMembersParams
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
      registerAfter,
      registerBefore,
      updateAfter,
      updateBefore,
      gender,
      baptism,
      marriage,
      group,
      officer,
      ministries,
      educations,
      selectedColumns,
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
        registerAfter,
        registerBefore,
        updateAfter,
        updateBefore,
        gender,
        baptism,
        marriage,
        group,
        officer,
        ministries,
        educations,
        vehicleNumber,
        select__group: true,
        select__mobilePhone: selectedColumns?.includes(MEMBER.MOBILE_PHONE),
        select__birth:
          selectedColumns?.includes(MEMBER.BIRTH) ||
          selectedColumns?.includes(MEMBER.AGE),
        select__gender: selectedColumns?.includes(MEMBER.GENDER),
        select__officer: selectedColumns?.includes(MEMBER.OFFICER),
        select__ministries: selectedColumns?.includes(MEMBER.MINISTRIES),
        select__educations: selectedColumns?.includes(MEMBER.EDUCATIONS),
        select__marriage: selectedColumns?.includes(MEMBER.MARRIAGE),
        select__address: selectedColumns?.includes(MEMBER.ADDRESS),
        select__homePhone: selectedColumns?.includes(MEMBER.HOME_PHONE),
        select__occupation: selectedColumns?.includes(MEMBER.OCCUPATION),
        select__school: selectedColumns?.includes(MEMBER.SCHOOL),
        select__vehicleNumber: selectedColumns?.includes(MEMBER.VEHICLE_NUMBER),
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/user-members`;

    try {
      return await axios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat',
            skipNulls: true,
            encodeValuesOnly: true,
          });
        },
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

  /**
   * 교인 불러오기
   * @param {GetMemberParams} params
   * @returns
   */
  public getMember = async (
    params: GetMemberParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

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

  /**
   * 교인 생성하기
   * @param {CreateMemberParams} params
   * @param {CreateMemberBody} body
   * @returns
   */
  public createMember = async (
    params: CreateMemberParams,
    body: CreateMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/members`;

    try {
      return await axios.post(url, body);
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
   * 교인 수정하기
   * @param  {EditMemberParams} params
   * @param  {EditMemberBody} body
   * @returns
   */
  public editMember = async (
    params: EditMemberParams,
    body: EditMemberBody
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

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

  /**
   * 교인 삭제하기
   * @param  {DeleteMemberParams} params
   * @returns
   */
  public deleteMember = async (
    params: DeleteMemberParams
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}`;

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
}
