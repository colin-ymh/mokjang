// 나이스 교육정보 개방 포털 API
// https://open.neis.go.kr/portal/mainPage.do
//
// 이 키는 클라이언트 URL(query)로 노출되는 공개 포털 키다. env로 옮겨
// 소스 커밋을 피하되, 배포 env 미설정 시 기존 동작을 보존하도록 fallback을 둔다.
// 이미 git 이력에 노출되었으므로 근본 해결은 NEIS 포털에서 키 재발급(rotate)이다.
// TODO: 배포 env에 NEXT_PUBLIC_NEIS_KEY 설정 후 아래 fallback 제거.
export const NEIS_KEY =
  process.env.NEXT_PUBLIC_NEIS_KEY || '26ca8243d6df4dbaa819c58994983455';
