"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setStage } from "@/redux/reducers/member-register-reducer";

import ExtraMemberRegisterView from "@/components/organisms/register/extra-register-view";
import { MEMBER_REGISTER_STAGE } from "@/constants/constant";

const ExtraMemberRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
  }, []);

  const props = {};

  return (
    <>
      <ExtraMemberRegisterView {...props} />
    </>
  );
};

export default ExtraMemberRegister;
