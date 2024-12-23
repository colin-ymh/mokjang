export default {
  none: "없음",
  null: "--",
  type: "종류",

  // 필수
  name: "이름",
  mobilePhone: "휴대전화",
  verifyNumber: "인증번호",
  guide: "인도자",
  family: "가족",
  relation: "가족관계",
  // 개인 정보
  profileImage: "이미지",
  birth: "생년월일",
  age: "나이",
  gender: "성별",
  occupation: "하시는 일",
  school: "학교",
  marriage: "결혼",
  detailMarriage: "결혼 상세 정보",
  address: "도로명 주소",
  detailAddress: "상세 주소",
  homePhone: "전화번호",
  vehicleNumber: "차량 번호",
  // 교회 관련 정보
  baptism: "신급",
  officer: "직분",
  officerStartDate: "임직일",
  officerStartChurch: "임직 교회",
  previousChurchName: "이전 교회 이름",

  group: "소그룹",
  ministry: "사역",
  education: "교육 이수",

  // 성별
  male: "남성",
  female: "여성",

  // baptism 세례
  baptized: "세례",
  immersionBaptism: "침례",
  infantBaptism: "유아세례",
  catechumenate: "학습",
  confirmation: "입교",

  // marriage 결혼
  married: "기혼",
  single: "미혼",

  // 양력 음력
  solar: "양력",
  lunar: "음력",

  churchMember: "성도",

  가족: "가족",
  배우자: "배우자",
  아버지: "아버지",
  어머니: "어머니",
  자녀: "자녀",
  형제자매: "형제자매",
  조부모: "조부모",
  사위: "사위",
  며느리: "며느리",
  시부: "시부",
  시모: "시모",
  장인: "장인",
  장모: "장모",
  친인척: "친인척",

  /*-------------------header (side bar button)-------------------*/
  "header.home": "홈",
  "header.member": "교인 관리",

  "header.memberInformation": "교인 정보",
  "header.personalInformation": "개인 정보",
  "header.familyInformation": "가족 정보",
  /*-------------------header (side bar button)-------------------*/

  /*-------------------member content (member header bar button)-------------------*/
  "member-content.memberList": "전체",
  "member-content.administratorList": "관리자",
  "member-content.newMemberList": "새신자",
  /*-------------------member content (member header bar button)-------------------*/

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

  "button.signIn": "회원가입 완료하기",

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
  "placeholder.officer": "직분을 입력해주세요",
  "placeholder.officerStartDate": "임직일을 입력해주세요. (yyyy-mm-dd) ",
  "placeholder.officerStartChurch": "임직 교회를 입력해주세요.",
  "placeholder.guide": "인도자를 입력해주세요.",
  "placeholder.previousChurchName": "이전 교회를 입력해주세요.",
  "placeholder.vehicleNumber": "4자리 입력",
  "placeholder.marriage": "결혼 상태를 입력해주세요",
  "placeholder.detailMarriage": "결혼 상세 상태를 입력해주세요",
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
