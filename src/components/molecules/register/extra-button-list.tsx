import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { setStage } from "@/redux/reducers/member-register-reducer";

import {
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constants/constant";
import RegisterButtonListView from "@/components/molecules/register/register-button-list.view";

import { useScopedI18n } from "../../../../locales/client";
import { RequestInfoApi } from "@/api/request-info.api";
import { getEditMemberBody } from "@/utils/member";

const ExtraButtonList = () => {
  const requestInfoApi = new RequestInfoApi(false);
  const { churchId, requestInfoId } = useParams() as {
    churchId: string;
    requestInfoId: string;
  };

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { type, stage, member } = useSelector(
    (state: RootState) => state.memberRegister,
  );
  const t_button = useScopedI18n("button");

  const onClickLeft = () => {
    if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      router.back();
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    }
  };

  const onClickRight = () => {
    if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      if (type === MEMBER_REGISTER_TYPE.NEW) {
        console.log({
          ...getEditMemberBody(member),
          name: member.name,
          mobilePhone: member.mobilePhone.replace(/\D/g, ""),
        });
        requestInfoApi
          .editRequestInfo(
            { churchId, requestInfoId },
            {
              ...getEditMemberBody(member),
              name: member.name,
              mobilePhone: member.mobilePhone.replace(/\D/g, ""),
            },
          )
          .then((response) => {
            console.log(response);
          });
      } else {
        dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
      }
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      requestInfoApi
        .editRequestInfo(
          { churchId, requestInfoId },
          {
            ...getEditMemberBody(member),
            name: member.name,
            mobilePhone: member.mobilePhone.replace(/\D/g, ""),
          },
        )
        .then((response) => {
          console.log(response);
        });
    }
  };

  const getRightButtonTitle = () => {
    if (type === MEMBER_REGISTER_TYPE.NEW) {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button("save");
        default:
          return t_button("save");
      }
    } else {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button("extra");
        case MEMBER_REGISTER_STAGE.RELIGIOUS:
          return t_button("save");
        default:
          return t_button("extra");
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
    </>
  );
};

export default ExtraButtonList;
