"use client";

import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import { TemporalMember } from "@/models/register/member-register";
import RequiredRegisterView from "@/components/molecules/register/required-register.view";
import { MEMBER_REGISTER_TYPE } from "@/constant/constant";

const RequiredRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

  // 새신자 타입 변경 시 이벤트
  const onChangeType = (type: MEMBER_REGISTER_TYPE) => {
    dispatch(setMember({ ...member, type }));
  };

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newName = event.target.value;
    dispatch(setMember({ ...newMember, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newMobilePhone = event.target.value;
    dispatch(setMember({ ...newMember, mobilePhone: newMobilePhone }));
    // 전화번호를 다 입력한 경우
    if (newMobilePhone.length > 12) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 인도자 변경 시 이벤트
  const onChangeGuide = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newGuide = event.target.value;
    dispatch(setMember({ ...newMember, guide: newGuide }));
  };

  // 가족 변경 시 이벤트
  const onChangeFamily = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newFamily = event.target.value;
    dispatch(setMember({ ...newMember, family: newFamily }));
  };

  const props = {
    onChangeType,
    onChangeName,
    onChangeMobilePhone,
    onChangeGuide,
    onChangeFamily,
  };

  return (
    <>
      <RequiredRegisterView {...props} />
    </>
  );
};

export default RequiredRegister;
