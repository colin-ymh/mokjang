'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMember, setType } from '@/redux/reducers/member-register-reducer';

import { GetMembersResponse, MembersApi } from '@/api/members/members.api';
import RequiredRegisterView from '@/components/molecules/register/required-register.view';
import {
  BLANK,
  FAMILY,
  GENDER,
  MEMBER_REGISTER_TYPE,
} from '@/constants/constant';

import {
  getFormattedMobilePhone,
  getFormattedName,
  getTrimmedString,
} from '@/utils/format';
import { getIsWellFormedMobilePhone } from '@/utils/check';
import { Member } from '@/models/member/member';
import { getAge, getDateFromDateString } from '@/utils/date';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { useDebounce } from '@/hooks/debounce/debounce';

const RequiredRegister = () => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );

  const member: Member = useSelector(
    (state: RootState): Member => state.memberRegister.member
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 인도자 이름
  const [guideName, setGuideName] = useState<string>(BLANK);

  // 검색된 인도자 목록
  const [guideItems, setGuideItems] = useState<MemberDropdownType[]>([]);

  // 가족 이름
  const [familyMemberName, setFamilyMemberName] = useState<string>(BLANK);

  // 검색된 가족 목록
  const [familyMemberItems, setFamilyMemberItems] = useState<
    MemberDropdownType[]
  >([]);
  // 선택된 가족의 성별
  const [familyGender, setFamilyGender] = useState<GENDER | undefined>();

  const debouncedGuideName = useDebounce(guideName, 500);
  const debouncedFamilyMemberName = useDebounce(familyMemberName, 500);

  // 새신자 타입 변경 시 이벤트
  const onChangeType = (type: MEMBER_REGISTER_TYPE) => {
    dispatch(setType(type));
  };

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    dispatch(setMember({ ...member, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    dispatch(setMember({ ...member, mobilePhone: newMobilePhone }));

    // 전화번호를 다 입력한 경우
    if (getIsWellFormedMobilePhone(newMobilePhone)) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 인도자 input 변경 시 이벤트
  const onChangeGuideName = (event: ChangeEvent<HTMLInputElement>) => {
    setGuideName(getTrimmedString(event.target.value));
  };

  const fetchGuideMembers = async () => {
    if (!debouncedGuideName) return;
    try {
      const response: AxiosResponse = await membersApi.getMembers({
        churchId,
        name: debouncedGuideName,
        page: 1,
        take: 5,
      });
      setGuideItems(
        response.data.data.map((member: GetMembersResponse) => ({
          value: member.id,
          title: member.name,
          gender: (member?.gender as GENDER) || undefined,
          profileImage: member.profileImage || undefined,
          age: member.birth
            ? getAge(getDateFromDateString(member.birth))
            : undefined,
        }))
      );
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    fetchGuideMembers();
  }, [debouncedGuideName]);

  // 인도자 dropdown 선택 시 이벤트
  const onChangeGuidedById = (value: string) => {
    const newGuide = guideItems.find((g) => g.value === value);
    if (newGuide) {
      setGuideName(newGuide.title);
    }
    dispatch(setMember({ ...member, guidedById: value }));
  };

  // 가족 이름 변경 시 이벤트
  const onChangeFamilyMemberName = (event: ChangeEvent<HTMLInputElement>) => {
    setFamilyMemberName(getTrimmedString(event.target.value));
  };

  const fetchFamilyMembers = async () => {
    if (!debouncedFamilyMemberName) return;
    try {
      const response: AxiosResponse = await membersApi.getMembers({
        churchId,
        name: debouncedFamilyMemberName,
        page: 1,
        take: 5,
      });
      setFamilyMemberItems(
        response.data.data.map((member: GetMembersResponse) => ({
          value: member.id,
          title: member.name,
          gender: (member?.gender as GENDER) || undefined,
          profileImage: member.profileImage || undefined,
          age: member.birth
            ? getAge(getDateFromDateString(member.birth))
            : undefined,
        }))
      );
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, [debouncedFamilyMemberName]);

  // 가족 선택 시 이벤트
  const onChangeFamilyMemberId = (value: string) => {
    const newFamily = familyMemberItems.find((g) => g.value === value);
    if (newFamily) {
      setFamilyMemberName(newFamily.title);
      setFamilyGender(newFamily.gender);
    }
    dispatch(setMember({ ...member, familyMemberId: value }));
  };

  const onChangeFamilyRelation = (value: FAMILY) => {
    dispatch(setMember({ ...member, relation: value }));
  };

  const props = {
    guideName,
    guideItems,
    familyMemberName,
    familyMemberItems,
    familyGender,
    onChangeType,
    onChangeName,
    onChangeMobilePhone,
    onChangeGuideName,
    onChangeGuidedById,
    onChangeFamilyMemberName,
    onChangeFamilyMemberId,
    onChangeFamilyRelation,
  };

  return (
    <>
      <RequiredRegisterView {...props} />
    </>
  );
};

export default RequiredRegister;
