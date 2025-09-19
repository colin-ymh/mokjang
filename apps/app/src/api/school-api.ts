import { NEIS_KEY } from '../configs/config';
import axios from 'axios';

// 네이스 API에서 반환되는 학교 정보 타입 정의
type NeisSchoolInfoType = {
  ATPT_OFCDC_SC_CODE: string; // 교육청 코드
  ATPT_OFCDC_SC_NM: string; // 교육청 이름
  SD_SCHUL_CODE: string; // 학교 코드
  SCHUL_NM: string; // 학교 이름
  ENG_SCHUL_NM: string; // 영어 학교 이름
  SCHUL_KND_SC_NM: string; // 학교 종류
  LCTN_SC_NM: string; // 위치
  JU_ORG_NM: string; // 기관 이름
  FOND_SC_NM: string; // 설립 유형
  ORG_RDNZC: string; // 우편번호
  ORG_RDNMA: string; // 주소
  ORG_RDNDA: string; // 상세 주소
  ORG_TELNO: string; // 전화번호
  HMPG_ADRES: string; // 홈페이지 주소
  COEDU_SC_NM: string; // 성별
  ORG_FAXNO: string; // 팩스번호
  HS_SC_NM: string; // 고등학교 종류
  INDST_SPECL_CCCCL_EXST_YN: string; // 산업 특성 여부
  HS_GNRL_BUSNS_SC_NM: string; // 일반고 비즈니스 유형
  SPCLY_PURPS_HS_ORD_NM: string | null; // 특수목적 고등학교
  ENE_BFE_SEHF_SC_NM: string; // 전기 관련 정보
  DGHT_SC_NM: string; // 주간 여부
  FOND_YMD: string; // 설립일 (YYYYMMDD 형식)
  FOAS_MEMRD: string; // 설립일 (기타)
  LOAD_DTM: string; // 데이터 로드 날짜 (YYYYMMDD 형식)
};

/**
 * 학교명을 통해 학교 기본정보를 검색하는 API
 * @param name 학교명 검색 키워드
 * @param pIndex 페이지 위치
 * @param pSize 페이지 당 신청 숫자
 * @returns NeisSchoolInfoType[] - 학교 정보 배열
 */
export const getSchool = async (
  name: string,
  pIndex: number = 1,
  pSize: number = 5
): Promise<NeisSchoolInfoType[]> => {
  const url = `https://open.neis.go.kr/hub/schoolInfo?KEY=${NEIS_KEY}&Type=json&pIndex=${pIndex}&pSize=${pSize}&SCHUL_NM=${name}`;

  try {
    const response = await axios.get(url);

    return response.data.schoolInfo[1].row;
  } catch (error) {
    // console.log('학교 검색 오류:', error);
    return [];
  }
};
