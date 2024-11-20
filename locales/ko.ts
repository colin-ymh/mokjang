export default {
  type: "종류",
  // 필수
  name: "이름",
  mobilePhone: "휴대전화",
  guide: "인도자",
  family: "가족",
  // 개인 정보
  birth: "생년월일",
  gender: "성별",
  occupation: "하시는 일",
  school: "학교",
  marriage: "결혼",
  address: "도로명 주소",
  homePhone: "전화번호",
  vehiclePlateNumber: "차량 번호",
  // 교회 관련 정보
  baptism: "신급",
  confirmation: "직분",
  confirmationStartDate: "임직일",
  confirmationStartChurch: "임직 교회",
  previousChurchName: "이전 교회 이름",
  // 성별
  male: "남성",
  female: "여성",

  /*-------------------placeholder-------------------*/
  "placeholder.name": "이름을 입력해주세요.",
  "placeholder.mobilePhone": "휴대전화 번호를 입력해주세요.",
  "placeholder.birth": "생년월일을 입력해주세요. (YYYY.MM.DD)",
  "placeholder.homePhone": "집 전화번호를 입력해주세요.",
  "placeholder.occupation": "직업을 입력해주세요.",
  "placeholder.address": "도로명주소를 입력해주세요.",
  "placeholder.school": "학교를 입력해주세요.",
  "placeholder.confirmation": "직분을 입력해주세요",
  "placeholder.confirmationStartDate": "임직일을 입력해주세요. (YYYY.MM.DD) ",
  "placeholder.confirmationStartChurch": "임직 교회를 입력해주세요.",
  "placeholder.guide": "인도자를 입력해주세요.",
  "placeholder.previousChurchName": "이전 교회를 입력해주세요.",
  "placeholder.vehiclePlateNumber": "차량 번호를 입력해주세요.",
  "placeholder.marriage": "결혼 상태를 입력해주세요",
  "placeholder.family": "가족을 입력해주세요.",
  /*-------------------placeholder-------------------*/

  /*-------------------dropdown-------------------*/
  // baptism
  "dropdown.baptism": "세례",
  "dropdown.immersionBaptism": "침례",
  "dropdown.infantBaptism": "유아세례",
  "dropdown.catechumenate": "학습",
  "dropdown.none": "없음",
  /*-------------------dropdown-------------------*/

  /*-------------------radiobutton-------------------*/
  "radiobutton.new": "새신자",
  "radiobutton.transferred": "기존 신자",
  /*-------------------radiobutton-------------------*/
} as const;
