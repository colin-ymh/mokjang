"use client";

import React, { ChangeEvent, RefObject, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember, setStage } from "@/redux/reducers/member-register-reducer";

import { TemporalMember } from "@/models/register/member-register";
import MemberRegisterView from "@/components/organisms/register/member-register.view";
import {
  BAPTISM,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";

const MemberRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
  }, []);

  const props = {};

  return (
    <>
      <MemberRegisterView {...props} />
    </>
  );
};

export default MemberRegister;
