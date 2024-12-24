import { MEMBER } from "@/constants/member/member-column";

export const getTranslatedMemberColumn = (
  t: (key: string, ...args: any[]) => string,
  id: MEMBER,
): string => {
  return t(
    id as
      | MEMBER.NAME
      | MEMBER.PROFILE_IMAGE
      | MEMBER.GENDER
      | MEMBER.OFFICER
      | MEMBER.AGE
      | MEMBER.MOBILE_PHONE
      | MEMBER.HOME_PHONE
      | MEMBER.ADDRESS
      | MEMBER.OCCUPATION
      | MEMBER.SCHOOL
      | MEMBER.MARRIAGE
      | MEMBER.BAPTISM
      | MEMBER.BIRTH
      | MEMBER.CREATED_AT
      | MEMBER.UPDATED_AT,
  );
};
