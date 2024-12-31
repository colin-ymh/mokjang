"use client";

import React, { ChangeEvent, useState } from "react";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember, setType } from "@/redux/reducers/member-register-reducer";

import { GetMembersResponse, MembersApi } from "@/api/churches/members.api";
import RequiredRegisterView from "@/components/molecules/register/required-register.view";
import {
  MEMBER_REGISTER_TYPE,
  BLANK,
  FAMILY,
  GENDER,
} from "@/constants/constant";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";

import {
  getFormattedMobilePhone,
  getFormattedName,
  getTrimmedString,
} from "@/utils/format";
import { getIsWellFormedMobilePhone } from "@/utils/check";
import { Member } from "@/models/member/member";

const RequiredRegister = () => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );

  const member: Member = useSelector(
    (state: RootState): Member => state.memberRegister.member,
  );

  // 인도자 이름
  const [guideName, setGuideName] = useState<string>(BLANK);
  // 검색된 인도자 목록
  const [guideItems, setGuideItems] = useState<DropdownValueType[]>([]);

  // 가족 이름
  const [familyMemberName, setFamilyMemberName] = useState<string>(BLANK);
  // 검색된 가족 목록
  const [familyMemberItems, setFamilyMemberItems] = useState<
    DropdownValueType[]
  >([]);
  // 선택된 가족의 성별
  const [familyGender, setFamilyGender] = useState<GENDER | undefined>();

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
    const newGuideName = getTrimmedString(event.target.value);
    setGuideName(newGuideName);

    if (newGuideName) {
      membersApi
        .getMembers({
          churchId,
          name: newGuideName,
          page: 1,
          take: 5,
        })
        .then((response: AxiosResponse) => {
          const members: GetMembersResponse[] = response.data.data;
          const newGuideItems: DropdownValueType[] = members.map((member) => {
            return {
              value: member.id,
              title: member.name,
              gender: member.gender,
            };
          });

          setGuideItems(newGuideItems);
        });
    }
  };

  // 인도자 dropdown 선택 시 이벤트
  const onChangeGuidedById = (value: string) => {
    dispatch(setMember({ ...member, guidedById: value }));
  };

  // 가족 이름 변경 시 이벤트
  const onChangeFamilyMemberName = (event: ChangeEvent<HTMLInputElement>) => {
    const newFamilyMemberName = getTrimmedString(event.target.value);
    setFamilyMemberName(newFamilyMemberName);

    if (newFamilyMemberName) {
      membersApi
        .getMembers({
          churchId,
          name: newFamilyMemberName,
          page: 1,
          take: 5,
        })
        .then((response: AxiosResponse) => {
          const members: GetMembersResponse[] = response.data.data;
          const newFamilyMemberItems: DropdownValueType[] = members.map(
            (member) => {
              return { value: member.id, title: member.name };
            },
          );

          setFamilyMemberItems(newFamilyMemberItems);
        });
    }
  };

  // 가족 선택 시 이벤트
  const onChangeFamilyMemberId = (value: string) => {
    dispatch(setMember({ ...member, familyMemberId: value }));

    membersApi.getMember({ churchId, memberId: value }).then((response) => {
      if (response.status === 200) {
        setFamilyGender(response.data.data.gender);
      }
    });
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
