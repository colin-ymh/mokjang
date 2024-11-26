export default {
  none: "None",
  type: "Type",
  // 필수
  name: "Name",
  mobilePhone: "Mobile Phone",
  guide: "Guide",
  family: "Family",
  // 개인 정보
  birth: "Date of Birth",
  gender: "Gender",
  occupation: "Occupation",
  school: "School",
  marriage: "Marriage",
  address: "Address",
  detailAddress: "Detail Address",
  homePhone: "Home Phone",
  vehicleNumber: "Vehicle Plate Number",
  // 교회 관련 정보
  baptism: "Baptism",
  confirmation: "Confirmation",
  confirmationStartDate: "Confirmation Start Date",
  confirmationStartChurch: "Confirmation Start Church",
  previousChurchName: "Previous Church",
  // 성별
  male: "Male",
  female: "Female",
  // baptism
  baptized: "Baptized",
  immersionBaptism: "Immersion Baptism",
  infantBaptism: "Infant Baptism",
  catechumenate: "Catechumenate",

  // confirmation
  elder: "Elder",
  exhorter: "Exhorter",
  ordainedDeacon: "Ordained Deacon",
  deacon: "Deacon",

  // marriage 결혼
  married: "Married",
  single: "Single",

  /*-------------------member register-------------------*/
  "register.defaultHeaderPhrase": "Please enter the member information",
  "register.extraHeaderPhrase": "Please enter the extra information",
  /*-------------------member register-------------------*/

  /*-------------------button-------------------*/
  "button.register": "Register",
  "button.save": "Save",
  "button.goBack": "Go Back",
  "button.extra": "Enter Extra",
  "button.invite": "Invite",

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
  "placeholder.confirmation": "Enter the confirmation.",
  "placeholder.confirmationStartDate":
    "Enter a confirmation start date. (e.g., yyyy-mm-dd)",
  "placeholder.confirmationStartChurch":
    "Enter a confirmation start church name.",
  "placeholder.guide": "Enter the guide's name.",
  "placeholder.previousChurchName": "Enter the name of the previous church.",
  "placeholder.vehicleNumber": "Enter the vehicle plate number.",
  "placeholder.marriage": "Enter the marriage state.",
  "placeholder.family": "Enter the family name.",
  /*-------------------placeholder-------------------*/

  /*-------------------radiobutton-------------------*/
  "radiobutton.new": "New Member",
  "radiobutton.transferred": "Transferred Member",
  /*-------------------radiobutton-------------------*/
} as const;
