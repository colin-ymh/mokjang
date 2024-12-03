"use client";

import React, { ChangeEvent, useState } from "react";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import { GetMembersResponse, MembersApi } from "@/api/members.api";
import RequiredRegisterView from "@/components/molecules/register/required-register.view";
import { MEMBER_REGISTER_TYPE } from "@/constant/constant";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { BLANK } from "@/common/default/default-value";
import { TemporalMember } from "@/models/register/member-register";
import {
  getFormattedMobilePhone,
  getFormattedName,
  getTrimmedString,
} from "@/utils/format";
import { getIsWellFormedMobilePhone } from "@/utils/check";

const RequiredRegister = () => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();

  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
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

  // 새신자 타입 변경 시 이벤트
  const onChangeType = (type: MEMBER_REGISTER_TYPE) => {
    dispatch(setMember({ ...member, type }));
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

    membersApi
      .getMembers({
        churchId: 1,
        name: newGuideName,
        page: 1,
        take: 5,
      })
      .then((response: AxiosResponse) => {
        const members: GetMembersResponse[] = response.data.data;
        const newGuideItems: DropdownValueType[] = members.map((member) => {
          return { value: member.id, title: member.name };
        });

        setGuideItems(newGuideItems);
      });
  };

  // 인도자 dropdown 선택 시 이벤트
  const onChangeGuidedById = (value: string) => {
    dispatch(setMember({ ...member, guidedById: value }));
  };

  // 가족 이름 변경 시 이벤트
  const onChangeFamilyMemberName = (event: ChangeEvent<HTMLInputElement>) => {
    const newFamilyMemberName = getTrimmedString(event.target.value);
    setFamilyMemberName(newFamilyMemberName);

    membersApi
      .getMembers({
        churchId: 1,
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
  };

  // 가족 선택 시 이벤트
  const onChangeFamilyMemberId = (value: string) => {
    dispatch(setMember({ ...member, family: value }));
  };

  const props = {
    guideName,
    guideItems,
    familyMemberName,
    familyMemberItems,
    onChangeType,
    onChangeName,
    onChangeMobilePhone,
    onChangeGuideName,
    onChangeGuidedById,
    onChangeFamilyMemberName,
    onChangeFamilyMemberId,
  };

  return (
    <>
      <RequiredRegisterView {...props} />
    </>
  );
};

export default RequiredRegister;
