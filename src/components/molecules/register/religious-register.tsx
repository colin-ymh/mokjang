"use client";

import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import ReligiousRegisterView from "@/components/molecules/register/religious-register.view";
import { BAPTISM } from "@/constants/constant";
import { getFormattedDate } from "@/utils/format";

const ReligiousRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { member } = useSelector((state: RootState) => state.memberRegister);

  // 신급
  const onChangeBaptism = (value: BAPTISM) => {
    dispatch(setMember({ ...member, baptism: value }));
  };

  // 직분 변경 시 이벤트
  const onChangeOfficer = (value: string) => {
    dispatch(
      setMember({
        ...member,
        officerId: value,
      }),
    );
  };

  // 임직일 날짜 변경 시 이벤트
  const onChangeOfficerStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newOfficerStartDate = getFormattedDate(event.target.value);
    dispatch(
      setMember({
        ...member,
        officerStartDate: newOfficerStartDate,
      }),
    );
  };

  // 임직 교회 변경 시 이벤트
  const onChangeOfficerStartChurch = (event: ChangeEvent<HTMLInputElement>) => {
    const newOfficerStartChurch = event.target.value;
    dispatch(
      setMember({
        ...member,
        officerStartChurch: newOfficerStartChurch,
      }),
    );
  };

  // 이전 교회 변경 시 이벤트
  const onChangePreviousChurchName = (event: ChangeEvent<HTMLInputElement>) => {
    const newPreviousChurchName = event.target.value;
    dispatch(
      setMember({ ...member, previousChurchName: newPreviousChurchName }),
    );
  };

  const props = {
    onChangeOfficer,
    onChangeOfficerStartDate,
    onChangeOfficerStartChurch,
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
