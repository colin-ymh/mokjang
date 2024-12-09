export default {
  none: "None",
  type: "Type",

  // 필수
  name: "Name",
  mobilePhone: "Mobile Phone",
  guide: "Guide",
  family: "Family",
  // 개인 정보
  profileImage: "Profile Image",
  birth: "Date of Birth",
  age: "Age",
  gender: "Gender",
  occupation: "Occupation",
  school: "School",
  marriage: "Marriage",
  detailMarriage: "Detail Marriage State",
  address: "Address",
  detailAddress: "Detail Address",
  homePhone: "Home Phone",
  vehicleNumber: "Vehicle Plate Number",
  // 교회 관련 정보
  baptism: "Baptism",
  officer: "Officer",
  officerStartDate: "Officer Start Date",
  officerStartChurch: "Officer Start Church",
  previousChurchName: "Previous Church",

  group: "Group",
  ministry: "Ministry",
  education: "Education",

  // 성별
  male: "Male",
  female: "Female",
  // baptism
  baptized: "Baptized",
  immersionBaptism: "Immersion Baptism",
  infantBaptism: "Infant Baptism",
  catechumenate: "Catechumenate",
  confirmation: "Confirmation",

  // officer
  elder: "Elder",
  exhorter: "Exhorter",
  ordainedDeacon: "Ordained Deacon",
  deacon: "Deacon",

  // marriage 결혼
  married: "Married",
  single: "Single",

  // 양력 음력
  solar: "Solar",
  lunar: "Lunar",

  /*-------------------header (side bar button)-------------------*/
  "header.home": "Home",
  "header.member": "Membership",

  "header.memberInformation": "Member Information",
  "header.personalInformation": "Personal Information",
  /*-------------------header (side bar button)-------------------*/

  /*-------------------member content (member header bar button)-------------------*/
  "member-content.memberList": "All",
  "member-content.administratorList": "Administrators",
  "member-content.newMemberList": "New Members",
  /*-------------------member content (member header bar button)-------------------*/

  /*-------------------member register-------------------*/
  "register.defaultHeaderPhrase": "Please enter the member information",
  "register.extraHeaderPhrase": "Please enter the extra information",

  "register.checkRegisterPhrase": "Please enter your information",
  "register.checkButton": "Confirm And Enter More",
  /*-------------------member register-------------------*/

  /*-------------------button-------------------*/
  "button.register": "Register",
  "button.save": "Save",
  "button.goBack": "Go Back",
  "button.extra": "Enter Extra",
  "button.invite": "Invite",
  "button.cancel": "Cancel",
  "button.confirm": "Confirm",

  /*-------------------button-------------------*/

  /*-------------------placeholder-------------------*/
  "placeholder.name": "Enter the name.",
  "placeholder.mobilePhone": "Enter the mobile phone number.",
  "placeholder.birth": "Enter the date of birth (e.g., YYYY.MM.DD).",
  "placeholder.homePhone": "Enter the home phone number.",
  "placeholder.occupation": "Enter the occupation.",
  "placeholder.address": "Enter the address.",
  "placeholder.detailAddress": "Enter the detail address.",
  "placeholder.school": "Enter the school name.",
  "placeholder.officer": "Enter the officer name.",
  "placeholder.officerStartDate":
    "Enter a officer start date. (e.g., yyyy-mm-dd)",
  "placeholder.officerStartChurch": "Enter a officer start church name.",
  "placeholder.guide": "Enter the guide's name.",
  "placeholder.previousChurchName": "Enter the name of the previous church.",
  "placeholder.vehicleNumber": "Enter the vehicle plate number.",
  "placeholder.marriage": "Enter the marriage state.",
  "placeholder.detailMarriage": "Enter the detail marriage state.",
  "placeholder.family": "Enter the family name.",
  /*-------------------placeholder-------------------*/

  /*-------------------radiobutton-------------------*/
  "radiobutton.new": "New Member",
  "radiobutton.transferred": "Transferred Member",
  /*-------------------radiobutton-------------------*/

  /*-------------------popup-------------------*/
  "popup.cancelRegisterTitle":
    "Do you want to cancel church member registration?",
  "popup.cancelRegisterContent": "The entered information will not be saved.",
  "popup.registerSuccess": "The church member has been registered.",
  /*-------------------popup-------------------*/
} as const;
