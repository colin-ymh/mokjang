import axios from 'axios';

export type Holiday = {
  dateName: string;
  locdate: number;
};

export const getHolidays = async (
  year: string,
  month: string
): Promise<Holiday[]> => {
  // 공공데이터포털 serviceKey. 클라이언트 URL에 노출되는 공개 키지만 소스 커밋을
  // 피하기 위해 env로 옮기고, 미설정 시 기존 동작 보존용 fallback을 둔다.
  // 이미 git 이력에 노출됐으므로 근본 해결은 포털에서 키 재발급(rotate)이다.
  // TODO: 배포 env에 NEXT_PUBLIC_HOLIDAY_SERVICE_KEY 설정 후 fallback 제거.
  const serviceKey =
    process.env.NEXT_PUBLIC_HOLIDAY_SERVICE_KEY ||
    'SqBnVPV5XO9FZ0QdMqAyDL5wRsTHkl371Wg4Bj%2Bt4ptRlBoDZJUI4MQ4fFSGCepK96iQO0Dtme%2FkarPXkDPqdw%3D%3D';

  const url =
    'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';

  const params = {
    serviceKey: decodeURIComponent(serviceKey),
    solYear: year,
    solMonth: month,
    _type: 'json',
  };

  try {
    const response = await axios.get(url, { params });

    const items = response.data.response?.body?.items?.item;

    if (!items) return [];

    // 단일 객체일 경우 배열로 감싸기
    return Array.isArray(items) ? items : [items];
  } catch (error) {
    console.error('공휴일 API 호출 오류:', error);
    return [];
  }
};
