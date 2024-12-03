import { TemporalMember } from "@/models/register/member-register";
import { CreateMembersBody } from "@/api/members.api";
import { getDateFromString, getIsChild } from "@/utils/date";
import { BLANK } from "@/common/default/default-value";
import { NONE } from "@/constant/constant";
import {
  getIsWellFormedBirth,
  getIsWellFormedHomePhone,
  getIsWellFormedVehicleNumber,
} from "@/utils/check";
import { getTrimmedString } from "@/utils/format";

export const getPostMember = (member: TemporalMember) => {
  const newMember: CreateMembersBody = {
    name: member.name,
    mobilePhone: member.mobilePhone.replace(/\D/g, ""),
  };

  if (member.guidedById) {
    newMember.guidedById = member.guidedById;
  }

  if (member.birth && getIsWellFormedBirth(member.birth)) {
    newMember.birth = member.birth.replace(/\D/g, "");
    newMember.isLunar = member.isLunar;

    // 미성년자인 경우에만, 학교 입력
    if (getIsChild(getDateFromString(member.birth))) {
      if (member.school) {
        newMember.school = member.school;
      }
    }
  }

  if (member.address) {
    newMember.address = member.address;

    // 도로명 주소를 입력하지 않은 상황에서,
    // 상세주소는 서버에 저장 X
    if (member.detailAddress) {
      newMember.detailAddress = getTrimmedString(member.detailAddress);
    }
  }

  if (member.homePhone && getIsWellFormedHomePhone(member.homePhone)) {
    newMember.homePhone = member.homePhone.replace(/\D/g, "");
  }

  if (member.occupation) {
    newMember.occupation = getTrimmedString(member.occupation);
  }

  if (member.gender) {
    newMember.gender = member.gender;
  }

  if (member.marriage !== NONE) {
    newMember.marriage = member.marriage;

    if (member.detailMarriage) {
      newMember.detailMarriage = getTrimmedString(member.detailMarriage);
    }
  }

  if (member.baptism !== NONE) {
    newMember.baptism = member.baptism;
  }

  if (member.previousChurchName) {
    newMember.previousChurchName = getTrimmedString(member.previousChurchName);
  }

  if (member.vehicleNumber) {
    const newVehicleNumber = member.vehicleNumber.filter(
      (number) => number !== BLANK && getIsWellFormedVehicleNumber(number),
    );

    if (newVehicleNumber.length > 0) {
      newMember.vehicleNumber = newVehicleNumber;
    }
  }

  console.log(newMember);
  return newMember;
};
