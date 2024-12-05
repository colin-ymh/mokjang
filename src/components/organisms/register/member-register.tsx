"use client";

import React, { useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setStage } from "@/redux/reducers/member-register-reducer";

import MemberRegisterView from "@/components/organisms/register/member-register.view";
import { MEMBER_REGISTER_STAGE } from "@/constants/constant";

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
