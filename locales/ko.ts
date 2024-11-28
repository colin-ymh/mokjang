export default {
  none: "없음",
  type: "종류",
  // 필수
  name: "이름",
  mobilePhone: "휴대전화",
  guide: "인도자",
  family: "가족",
  // 개인 정보
  image: "이미지",
  birth: "생년월일",
  gender: "성별",
  occupation: "하시는 일",
  school: "학교",
  marriage: "결혼",
  address: "도로명 주소",
  detailAddress: "상세 주소",
  homePhone: "전화번호",
  vehicleNumber: "차량 번호",
  // 교회 관련 정보
  baptism: "신급",
  confirmation: "직분",
  confirmationStartDate: "임직일",
  confirmationStartChurch: "임직 교회",
  previousChurchName: "이전 교회 이름",
  // 성별
  male: "남성",
  female: "여성",

  // baptism 세례
  baptized: "세례",
  immersionBaptism: "침례",
  infantBaptism: "유아세례",
  catechumenate: "학습",

  // confirmation 직분
  member: "교인",
  elder: "장로",
  exhorter: "권사",
  ordainedDeacon: "안수집사",
  deacon: "집사",

  // marriage 결혼
  married: "기혼",
  single: "미혼",

  /*-------------------member register-------------------*/
  "register.defaultHeaderPhrase": "교인 정보를 입력해주세요",
  "register.extraHeaderPhrase": "상세 정보를 입력해주세요",

  "register.checkRegisterPhrase": "성도님의 정보를 입력해주세요",
  "register.checkButton": "확인하고 상세정보 입력하기",

  /*-------------------member register-------------------*/

  /*-------------------button-------------------*/
  "button.register": "등록하기",
  "button.save": "저장",
  "button.goBack": "이전으로",
  "button.extra": "더 입력하기",
  "button.invite": "초대하기",
  "button.cancel": "취소",
  "button.confirm": "확인",

  /*-------------------button-------------------*/

  /*-------------------placeholder-------------------*/
  "placeholder.name": "이름을 입력해주세요.",
  "placeholder.mobilePhone": "휴대전화 번호를 입력해주세요.",
  "placeholder.birth": "생년월일을 입력해주세요. (yyyy-mm-dd)",
  "placeholder.homePhone": "집 전화번호를 입력해주세요.",
  "placeholder.occupation": "직업을 입력해주세요.",
  "placeholder.address": "도로명 주소를 입력해주세요.",
  "placeholder.detailAddress": "상세 주소를 입력해주세요.",
  "placeholder.school": "학교를 입력해주세요.",
  "placeholder.confirmation": "직분을 입력해주세요",
  "placeholder.confirmationStartDate": "임직일을 입력해주세요. (yyyy-mm-dd) ",
  "placeholder.confirmationStartChurch": "임직 교회를 입력해주세요.",
  "placeholder.guide": "인도자를 입력해주세요.",
  "placeholder.previousChurchName": "이전 교회를 입력해주세요.",
  "placeholder.vehicleNumber": "4자리 입력",
  "placeholder.marriage": "결혼 상태를 입력해주세요",
  "placeholder.family": "가족을 입력해주세요.",
  /*-------------------placeholder-------------------*/

  /*-------------------radiobutton-------------------*/
  "radiobutton.new": "새신자",
  "radiobutton.transferred": "기존 신자",
  /*-------------------radiobutton-------------------*/

  /*-------------------popup-------------------*/
  "popup.cancelRegisterTitle": "교인 등록을 종료하시겠습니까?",
  "popup.cancelRegisterContent": "입력된 정보는 저장되지 않습니다.",
  "popup.registerSuccess": "교인이 등록되었습니다.",
  /*-------------------popup-------------------*/
} as const;
