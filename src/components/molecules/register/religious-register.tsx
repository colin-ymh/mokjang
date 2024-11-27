"use client";

import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import { TemporalMember } from "@/models/register/member-register";
import ReligiousRegisterView from "@/components/molecules/register/religious-register.view";
import { BAPTISM } from "@/constant/constant";

const ReligiousRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { member } = useSelector((state: RootState) => state.memberRegister);

  // 직분 변경 시 이벤트
  const onChangeConfirmation = (value: string) => {
    const newMember: TemporalMember = member;
    dispatch(
      setMember({
        ...newMember,
        confirmation: value,
      }),
    );
  };

  // 임직일 날짜 변경 시 이벤트
  const onChangeConfirmationStartDate = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newConfirmationStartDate = event.target.value;
    dispatch(
      setMember({
        ...newMember,
        confirmationStartDate: newConfirmationStartDate,
      }),
    );
  };

  // 임직 교회 변경 시 이벤트
  const onChangeConfirmationStartChurch = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newConfirmationStartChurch = event.target.value;
    dispatch(
      setMember({
        ...newMember,
        confirmationStartChurch: newConfirmationStartChurch,
      }),
    );
  };

  // 신급
  const onChangeBaptism = (value: BAPTISM) => {
    dispatch(setMember({ ...member, baptism: value }));
  };

  // 이전 교회 변경 시 이벤트
  const onChangePreviousChurchName = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newPreviousChurchName = event.target.value;
    dispatch(
      setMember({ ...newMember, previousChurchName: newPreviousChurchName }),
    );
  };

  const props = {
    onChangeConfirmation,
    onChangeConfirmationStartDate,
    onChangeConfirmationStartChurch,
    onChangeBaptism,
    onChangePreviousChurchName,
  };

  return (
    <>
      <ReligiousRegisterView {...props} />
    </>
  );
};

export default ReligiousRegister;
