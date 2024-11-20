export default {
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
  homePhone: "Home Phone",
  vehiclePlateNumber: "Vehicle Plate Number",
  // 교회 관련 정보
  baptism: "Baptism",
  confirmation: "Confirmation",
  confirmationStartDate: "Confirmation Start Date",
  confirmationStartChurch: "Confirmation Start Church",
  previousChurchName: "Previous Church",
  // 성별
  male: "Male",
  female: "Female",

  // placeholder
  "placeholder.name": "Enter the name.",
  "placeholder.mobilePhone": "Enter the mobile phone number.",
  "placeholder.birth": "Enter the date of birth (e.g., YYYY.MM.DD).",
  "placeholder.homePhone": "Enter the home phone number.",
  "placeholder.occupation": "Enter the occupation.",
  "placeholder.address": "Enter the address.",
  "placeholder.school": "Enter the school name.",
  "placeholder.confirmation": "Enter the confirmation.",
  "placeholder.confirmationStartDate":
    "Enter a confirmation start date. (e.g., YYYY.MM.DD)",
  "placeholder.confirmationStartChurch":
    "Enter a confirmation start church name.",
  "placeholder.guide": "Enter the guide's name.",
  "placeholder.previousChurchName": "Enter the name of the previous church.",
  "placeholder.vehiclePlateNumber": "Enter the vehicle plate number.",
  "placeholder.marriage": "Enter the marriage state.",
  "placeholder.family": "Enter the family name.",

  /*-------------------dropdown-------------------*/
  // baptism
  "dropdown.baptism": "Baptism",
  "dropdown.immersionBaptism": "Immersion Baptism",
  "dropdown.infantBaptism": "Infant Baptism",
  "dropdown.catechumenate": "Catechumenate",
  "dropdown.none": "None",
  /*-------------------dropdown-------------------*/
} as const;
