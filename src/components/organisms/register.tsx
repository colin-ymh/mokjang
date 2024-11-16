"use client";

import { ChangeEvent } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import RegisterView from "@/components/organisms/register.view";
import { MemberRegisterType } from "@/models/register/member-register";

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const member: MemberRegisterType = useSelector(
    (state: RootState): MemberRegisterType => state.memberRegister.member,
  );

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: MemberRegisterType = member;
    const newName = event.target.value;
    dispatch(setMember({ ...newMember, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangePersonalPhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: MemberRegisterType = member;
    const newPersonalPhone = event.target.value;
    dispatch(setMember({ ...newMember, personalPhone: newPersonalPhone }));
  };

  // 전화번호 변경 시 이벤트
  const onChangeHomePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: MemberRegisterType = member;
    const newHomePhone = event.target.value;
    dispatch(setMember({ ...newMember, homePhone: newHomePhone }));
  };

  // 직업 변경 시 이벤트
  const onChangeJob = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: MemberRegisterType = member;
    const newJob = event.target.value;
    dispatch(setMember({ ...newMember, job: newJob }));
  };

  const props = {
    onChangeName,
    onChangePersonalPhone,
    onChangeHomePhone,
    onChangeJob,
  };

  return (
    <>
      <RegisterView {...props} />
    </>
  );
};

export default Register;
