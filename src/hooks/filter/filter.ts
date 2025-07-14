import { BAPTISM, GENDER, MARRIAGE } from '@/constants/constant';
import { MEMBER } from '@/constants/column/member-column';
import { ChurchInformation } from '@/models/member/member';

export const useMemberFilterContent = (
  t: (key: string, ...args: any[]) => string,
  officers: ChurchInformation[],
  educations: ChurchInformation[],
  ministries: ChurchInformation[],
  id: MEMBER
) => {
  // 성별인 경우
  const genderFilterItems = [
    {
      value: GENDER.MALE,
      title: t(GENDER.MALE),
    },
    {
      value: GENDER.FEMALE,
      title: t(GENDER.FEMALE),
    },
  ];

  // 직분인 경우
  const officerFilterItems = officers?.map((item) => {
    return { value: item.id, title: item.name };
  });

  // 교육인 경우
  const educationsFilterItems = educations?.map((item) => {
    return { value: item.id, title: item.name };
  });

  // 교육인 경우
  const ministriesFilterItems = ministries?.map((item) => {
    return { value: item.id, title: item.name };
  });



  // 결혼인 경우
  const marriageFilterItems = [
    {
      value: MARRIAGE.SINGLE,
      title: t(MARRIAGE.SINGLE),
    },
    {
      value: MARRIAGE.MARRIED,
      title: t(MARRIAGE.MARRIED),
    },
  ];

  // 신급인 경우
  const baptismFilterItems = [
    {
      value: BAPTISM.BAPTIZED,
      title: t(BAPTISM.BAPTIZED),
    },
    {
      value: BAPTISM.IMMERSION_BAPTISM,
      title: t(BAPTISM.IMMERSION_BAPTISM),
    },
    {
      value: BAPTISM.INFANT_BAPTISM,
      title: t(BAPTISM.INFANT_BAPTISM),
    },
    {
      value: BAPTISM.CONFIRMATION,
      title: t(BAPTISM.CONFIRMATION),
    },
    {
      value: BAPTISM.CATECHUMENATE,
      title: t(BAPTISM.CATECHUMENATE),
    },
  ];

  switch (id) {
    case MEMBER.GENDER:
      return genderFilterItems;
    case MEMBER.OFFICER:
      return officerFilterItems;
    case MEMBER.EDUCATIONS:
      return educationsFilterItems;
    case MEMBER.MINISTRIES:
      return ministriesFilterItems;
    case MEMBER.MARRIAGE:
      return marriageFilterItems;
    case MEMBER.BAPTISM:
      return baptismFilterItems;
    default:
      return null;
  }
};
