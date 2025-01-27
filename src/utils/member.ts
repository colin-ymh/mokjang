import { BLANK, NONE, NULL } from '@/constants/constant';
import {
  getIsWellFormedBirth,
  getIsWellFormedHomePhone,
  getIsWellFormedVehicleNumber,
} from '@/utils/check';
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getTrimmedString,
} from '@/utils/format';
import { CreateMemberBody, EditMemberBody } from '@/api/churches/members.api';
import { Member } from '@/models/member/member';

export const getCreateMemberBody = (member: Member) => {
  const newMember: CreateMemberBody = {
    name: member.name,
    mobilePhone: member.mobilePhone.replace(/\D/g, ''),
  };

  if (member.guidedById) {
    newMember.guidedById = member.guidedById;
  }

  if (member.familyMemberId) {
    newMember.familyMemberId = member.familyMemberId;
  }

  if (member.relation) {
    newMember.relation = member.relation;
  }

  return newMember;
};

export const getEditMemberBody = (member: Member) => {
  const newMember: EditMemberBody = {};

  if (member.guidedById) {
    newMember.guidedById = member.guidedById;
  }

  if (member.birth && getIsWellFormedBirth(member.birth)) {
    newMember.birth = member.birth;
    newMember.isLunar = member.isLunar;

    // // 미성년자인 경우에만, 학교 입력
    // if (getIsChild(getDateFromString(member.birth))) {
    //   if (member.school && getTrimmedString(member.school)) {
    //     newMember.school = member.school;
    //   }
    // }
  }

  if (member.school && getTrimmedString(member.school)) {
    newMember.school = member.school;
  }

  if (member.address && getTrimmedString(member.address)) {
    newMember.address = member.address;

    // 도로명 주소를 입력하지 않은 상황에서,
    // 상세주소는 서버에 저장 X
    if (member.detailAddress && getTrimmedString(member.detailAddress)) {
      newMember.detailAddress = member.detailAddress;
    }
  }

  if (member.homePhone && getIsWellFormedHomePhone(member.homePhone)) {
    newMember.homePhone = member.homePhone.replace(/\D/g, '');
  }

  if (member.occupation && getTrimmedString(member.occupation)) {
    newMember.occupation = member.occupation;
  }

  if (member.gender) {
    newMember.gender = member.gender;
  }

  if (member.marriage !== NULL) {
    newMember.marriage = member.marriage;

    if (member.detailMarriage && getTrimmedString(member.detailMarriage)) {
      newMember.detailMarriage = member.detailMarriage;
    }
  }

  if (member.baptism !== NONE) {
    newMember.baptism = member.baptism;
  }

  if (member.previousChurch && getTrimmedString(member.previousChurch)) {
    newMember.previousChurch = member.previousChurch;
  }

  if (member.vehicleNumber) {
    const newVehicleNumber = member.vehicleNumber.filter(
      (number: string) =>
        number !== BLANK && getIsWellFormedVehicleNumber(number)
    );

    if (newVehicleNumber.length > 0) {
      newMember.vehicleNumber = newVehicleNumber;
    }
  }

  return newMember;
};

/**
 * 서버에서 받은 멤버 정보를 클라이언트에서 사용 가능하도록 변경해주는 함수
 * @param member
 */
export const getMemberFromServer = (member: Member) => {
  const newMember: Member = {
    ...member,
    birth: member?.birth ? getFormattedDate(member.birth) : BLANK,
    mobilePhone: member?.mobilePhone
      ? getFormattedMobilePhone(member.mobilePhone)
      : BLANK,
    homePhone: member?.homePhone
      ? getFormattedHomePhone(member.homePhone)
      : BLANK,
  };

  return newMember;
};
