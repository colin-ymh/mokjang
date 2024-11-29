import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setStage } from "@/redux/reducers/member-register-reducer";

import {
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";
import RegisterButtonListView from "@/components/molecules/register/register-button-list.view";

import { useScopedI18n } from "../../../../locales/client";
import ToastPopup from "@/components/atoms/common/popup/toast-popup";

const RegisterButtonList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stage, member } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  const t_popup = useScopedI18n("popup");
  const t_button = useScopedI18n("button");

  const [isToastShow, setIsToastShow] = useState<boolean>(false);

  const onClickLeft = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      console.log("초대하기");
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    }
  };

  const onClickRight = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
      setIsToastShow(true);
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      if (member.type === MEMBER_REGISTER_TYPE.NEW) {
        console.log("no where to go");
      } else {
        dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
      }
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      console.log("no where to go");
    }
  };

  const getRightButtonTitle = () => {
    if (member.type === MEMBER_REGISTER_TYPE.NEW) {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.REQUIRED:
          return t_button("register");
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button("save");
        default:
          return t_button("register");
      }
    } else {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.REQUIRED:
          return t_button("register");
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button("extra");
        case MEMBER_REGISTER_STAGE.RELIGIOUS:
          return t_button("save");
        default:
          return t_button("register");
      }
    }
  };

  const props = {
    onClickLeft,
    onClickRight,
    getRightButtonTitle,
  };

  return (
    <>
      <RegisterButtonListView {...props} />
      {isToastShow && (
        <ToastPopup
          setIsShow={setIsToastShow}
          isDeletable={true}
          text={t_popup("registerSuccess")}
        />
      )}
    </>
  );
};

export default RegisterButtonList;
