import { AxiosResponse } from 'axios';
import qs from 'qs';

import { BAPTISM, MARRIAGE, MEMBER, ORDER_DIRECTION } from '@mokjang/constants';
import { CustomError } from '../error/error';
import authorizeAxios from '../authorize-axios';
import { IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL } from '@mokjang/utils';

// type GetMembersParams = {
//   churchId: string; // 교회 id
//   page?: number; // 페이지 번호
//   take?: number; // 요청 개수
//   order?: MEMBER; // 정렬 기준
//   orderDirection?: ORDER_DIRECTION; // 오름차순 내림차순
//
//   // 필터링 내용
//   name?: string; // 검색 이름
//   mobilePhone?: string;
//   birthAfter?: string;
//   birthBefore?: string;
//   registerAfter?: string;
//   registerBefore?: string;
//   updateAfter?: string;
//   updateBefore?: string;
//   school?: string;
//   address?: string;
//   homePhone?: string;
//   occupation?: string;
//   vehicleNumber?: string;
//   group?: string[];
//   officer?: string[];
//   ministries?: string[];
//   educations?: string[];
//   baptism?: string[];
//   gender?: string[];
//   marriage?: string[];
//
//   //   활성화된 컬럼들
//   selectedColumns?: MEMBER[];
// };

type GetMembersV2Params = {
  churchId: string; // 교회 id
  cursor?: string; // 페이지 번호
  limit?: number; // 요청 개수
  sortBy?: MEMBER; // 정렬 기준
  sortDirection?: ORDER_DIRECTION; // 오름차순 내림차순
  displayColumns?: (MEMBER | '')[];

  groupIds?: (string | null)[];
  officerIds?: (string | null)[];
  marriageStatuses?: (MARRIAGE | null)[];
  baptismStatuses?: BAPTISM[];
  birthFrom?: string;
  birthTo?: string;
  registeredFrom?: string;
  registeredTo?: string;

  search?: string;
};

// export type GetMembersResponse = Member;

type GetMemberParams = {
  churchId: string; // 교회 id
  memberId: string;
};

// type GetSimpleMembersParams = {
//   churchId: string;
//   take?: number;
//   page?: number;
//   order?: MEMBER;
//   orderDirection?: ORDER_DIRECTION;
//   name?: string;
//   mobilePhone?: string;
// };

type GetSimpleMembersV2Params = {
  churchId: string;
  limit?: number;
  cursor?: string;
  sort?: MEMBER;
  sortDirection?: ORDER_DIRECTION;
  name?: string;
  mobilePhone?: string;
};

type CreateMemberParams = {
  churchId: string;
};

export type CreateMemberBody = {
  name: string;
  mobilePhone: string;
  birth?: string;
  isLunar?: boolean;
  isLeafMonth?: boolean;
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
  registeredAt?: string;
  profileImageUrl?: string;
};

type EditMemberParams = {
  churchId: string;
  memberId: string;
};

export type EditMemberBody = {
  name?: string;
  mobilePhone?: string;
  profileImageUrl?: string;
  birth?: string;
  isLunar?: boolean;
  isLeafMonth?: boolean;
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
  registeredAt?: string;
};

type DeleteMemberParams = {
  churchId: string;
  memberId: string;
};

type GetMemberWorshipAvailable = {
  churchId: string;
  memberId: string;
};

type GetMemberWorshipStatistics = {
  churchId: string;
  memberId: string;
  worshipId: string;
  from?: string;
  to?: string;
};

type CreateMembersBulkParams = {
  churchId: string;
};

type CreateMembersBulkBody = {
  members: any[];
};

type GetMemberWorshipAttendances = {
  churchId: string;
  memberId: string;
  worshipId: string;
  limit?: number;
  cursor?: string;
  sortDirection?: ORDER_DIRECTION;
  from?: string;
  to?: string;
};

export class MembersApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = IS_PRODUCTION
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  // /**
  //  * 교인들 불러오기
  //  * @param {GetMembersParams} params
  //  * @returns {Promise<AxiosResponse>}
  //  */
  // public getMembers = async (
  //   params: GetMembersParams
  // ): Promise<AxiosResponse> => {
  //   const {
  //     churchId,
  //     take = 5,
  //     page = 1,
  //     order,
  //     orderDirection,
  //     name,
  //     mobilePhone,
  //     school,
  //     address,
  //     homePhone,
  //     occupation,
  //     vehicleNumber,
  //     birthAfter,
  //     birthBefore,
  //     registerAfter,
  //     registerBefore,
  //     updateAfter,
  //     updateBefore,
  //     gender,
  //     baptism,
  //     marriage,
  //     group,
  //     officer,
  //     ministries,
  //     educations,
  //     selectedColumns,
  //   } = params;
  //
  //   const queryParams: Record<string, any> = Object.fromEntries(
  //     Object.entries({
  //       take,
  //       page,
  //       order,
  //       orderDirection,
  //       name,
  //       mobilePhone,
  //       school,
  //       address,
  //       homePhone,
  //       occupation,
  //       birthAfter,
  //       birthBefore,
  //       registerAfter,
  //       registerBefore,
  //       updateAfter,
  //       updateBefore,
  //       gender,
  //       baptism,
  //       marriage,
  //       group,
  //       officer,
  //       ministries,
  //       educations,
  //       vehicleNumber,
  //       select__group: true,
  //       select__mobilePhone: selectedColumns?.includes(MEMBER.MOBILE_PHONE),
  //       select__birth:
  //         selectedColumns?.includes(MEMBER.BIRTH) ||
  //         selectedColumns?.includes(MEMBER.AGE),
  //       select__gender: selectedColumns?.includes(MEMBER.GENDER),
  //       select__officer: selectedColumns?.includes(MEMBER.OFFICER),
  //       select__ministries: selectedColumns?.includes(MEMBER.MINISTRIES),
  //       select__educations: selectedColumns?.includes(MEMBER.EDUCATIONS),
  //       select__marriage: selectedColumns?.includes(MEMBER.MARRIAGE),
  //       select__address: selectedColumns?.includes(MEMBER.ADDRESS),
  //       select__homePhone: selectedColumns?.includes(MEMBER.HOME_PHONE),
  //       select__occupation: selectedColumns?.includes(MEMBER.OCCUPATION),
  //       select__school: selectedColumns?.includes(MEMBER.SCHOOL),
  //       select__vehicleNumber: selectedColumns?.includes(MEMBER.VEHICLE_NUMBER),
  //     }).filter(
  //       ([_, value]) =>
  //         value !== undefined &&
  //         value !== '' &&
  //         !(Array.isArray(value) && value.length === 0)
  //     )
  //   );
  //
  //   const url = `${this._url}/churches/${churchId}/members`;
  //
  //   try {
  //     return await authorizeAxios.get(url, {
  //       params: queryParams,
  //       paramsSerializer: (params) => {
  //         return qs.stringify(params, {
  //           arrayFormat: 'repeat',
  //           skipNulls: true,
  //           encodeValuesOnly: true,
  //         });
  //       },
  //     });
  //   } catch (serverError: any) {
  //     if (serverError.response) {
  //       const { message, error, statusCode } = serverError.response.data;
  //       throw new CustomError(message, error, statusCode);
  //     } else {
  //       throw new CustomError(
  //         '알 수 없는 에러가 발생했습니다',
  //         500,
  //         'Unknown Error'
  //       );
  //     }
  //   }
  // };

  /**
   * 교인들 불러오기
   * @param {GetMembersParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMembersV2 = async (
    params: GetMembersV2Params
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      limit,
      cursor,
      sortBy,
      sortDirection,
      displayColumns,
      groupIds,
      officerIds,
      marriageStatuses,
      baptismStatuses,
      birthFrom,
      birthTo,
      registeredFrom,
      registeredTo,
      search,
    } = params;

    // groupIds가 [null]인 경우 서버에 null로 전달
    const groupIdsParam =
      Array.isArray(groupIds) && groupIds.length === 1 && groupIds[0] === null
        ? 'null' // 서버가 문자열 'null'을 기대하므로 문자열로 직렬화
        : groupIds;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        limit,
        cursor,
        sortBy,
        sortDirection,
        displayColumns,
        groupIds: groupIdsParam,
        officerIds,
        marriageStatuses,
        baptismStatuses,
        birthFrom,
        birthTo,
        registeredFrom,
        registeredTo,
        search,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/members/v2`;

    try {
      return await authorizeAxios.get(url, {
        params: queryParams,
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: 'repeat',
            // skipNulls: true,
            strictNullHandling: true,
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

  // /**
  //  * 교인들 불러오기
  //  * @param {GetSimpleMembersParams} params
  //  * @returns {Promise<AxiosResponse>}
  //  */
  // public getSimpleMembers = async (
  //   params: GetSimpleMembersParams
  // ): Promise<AxiosResponse> => {
  //   const {
  //     churchId,
  //     take = 5,
  //     page = 1,
  //     order,
  //     orderDirection,
  //     name,
  //     mobilePhone,
  //   } = params;
  //
  //   const queryParams: Record<string, any> = Object.fromEntries(
  //     Object.entries({
  //       take,
  //       page,
  //       order,
  //       orderDirection,
  //       name,
  //       mobilePhone,
  //     }).filter(
  //       ([_, value]) =>
  //         value !== undefined &&
  //         value !== '' &&
  //         !(Array.isArray(value) && value.length === 0)
  //     )
  //   );
  //
  //   const url = `${this._url}/churches/${churchId}/members/simple`;
  //
  //   try {
  //     return await authorizeAxios.get(url, {
  //       params: queryParams,
  //       paramsSerializer: (params) => {
  //         return qs.stringify(params, {
  //           arrayFormat: 'repeat',
  //           skipNulls: true,
  //           encodeValuesOnly: true,
  //         });
  //       },
  //     });
  //   } catch (serverError: any) {
  //     if (serverError.response) {
  //       const { message, error, statusCode } = serverError.response.data;
  //       throw new CustomError(message, error, statusCode);
  //     } else {
  //       throw new CustomError(
  //         '알 수 없는 에러가 발생했습니다',
  //         500,
  //         'Unknown Error'
  //       );
  //     }
  //   }
  // };

  /**
   * 교인들 불러오기
   * @param {GetSimpleMembersV2Params} params
   * @returns {Promise<AxiosResponse>}
   */
  public getSimpleMembersV2 = async (
    params: GetSimpleMembersV2Params
  ): Promise<AxiosResponse> => {
    const { churchId, limit, cursor, sort, sortDirection, name, mobilePhone } =
      params;

    const queryParams: Record<string, any> = Object.fromEntries(
      Object.entries({
        limit,
        cursor,
        sort,
        sortDirection,
        name,
        mobilePhone,
      }).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0)
      )
    );

    const url = `${this._url}/churches/${churchId}/members/simple/v2`;

    try {
      return await authorizeAxios.get(url, {
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

  /**
   * 교인의 예배 조회
   * @param {GetMemberWorshipAvailable} params
   * @returns
   */
  public getMemberWorshipAvailable = async (
    params: GetMemberWorshipAvailable
  ): Promise<AxiosResponse> => {
    const { churchId, memberId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/worship/available`;

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
   * 교인의 예배 출석률 조회
   * @param {GetMemberWorshipStatistics} params
   * @returns
   */
  public getMemberWorshipStatistics = async (
    params: GetMemberWorshipStatistics
  ): Promise<AxiosResponse> => {
    const { churchId, memberId, worshipId } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/worship/statistics`;

    try {
      return await authorizeAxios.get(url, { params: { worshipId } });
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
   * 교인의 출석 정보 조회
   * @param {GetMemberWorshipAttendances} params
   * @returns
   */
  public getMemberWorshipAttendances = async (
    params: GetMemberWorshipAttendances
  ): Promise<AxiosResponse> => {
    const {
      churchId,
      memberId,
      worshipId,
      limit,
      cursor,
      sortDirection,
      to,
      from,
    } = params;

    const url = `${this._url}/churches/${churchId}/members/${memberId}/worship/attendances`;

    try {
      return await authorizeAxios.get(url, {
        params: { worshipId, limit, cursor, sortDirection, to, from },
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
   * @param {CreateMembersBulkParams} params
   * @param {CreateMembersBulkBody} body
   * @returns
   */
  public createMembersBulk = async (
    params: CreateMembersBulkParams,
    body: CreateMembersBulkBody
  ): Promise<AxiosResponse> => {
    const { churchId } = params;

    const url = `${this._url}/churches/${churchId}/members/bulk`;

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
}
