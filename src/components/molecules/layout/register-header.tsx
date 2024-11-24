import RegisterHeaderView from "@/components/molecules/layout/register-header.view";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setStage } from "@/redux/reducers/member-register-reducer";
import { MEMBER_REGISTER_STAGE } from "@/constant/constant";
import { useEffect, useState } from "react";

const RegisterHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stage, member } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  const onClickGoBack = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      console.log("no where to go");
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    }
  };

  const onClickGoNext = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      console.log("no where to go");
    }
  };

  const props = {
    onClickGoBack,
    onClickGoNext,
  };

  return (
    <>
      <RegisterHeaderView {...props} />
    </>
  );
};
export default RegisterHeader;
