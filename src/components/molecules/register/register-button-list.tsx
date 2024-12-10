import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember, setStage } from "@/redux/reducers/member-register-reducer";

import {
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constants/constant";
import RegisterButtonListView from "@/components/molecules/register/register-button-list.view";
import ToastPopup from "@/components/atoms/common/popup/toast-popup";
import { MembersApi } from "@/api/churches/members.api";
import { RequestInfoApi } from "@/api/churches/request-info.api";
import { getCreateMemberBody, getEditMemberBody } from "@/utils/member";

import { useScopedI18n } from "../../../../locales/client";

const RegisterButtonList = () => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );

  const requestInfoApi = new RequestInfoApi(false);

  const { type, stage, member } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  const t_popup = useScopedI18n("popup");
  const t_button = useScopedI18n("button");

  const [isToastShow, setIsToastShow] = useState<boolean>(false);

  const onClickLeft = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      requestInfoApi.inviteMember(
        { churchId, isTest: true },
        getCreateMemberBody(member),
      );
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    }
  };

  const onClickRight = () => {
    // 최초 화면
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      // 최초 교인 등록
      membersApi
        .createMember({ churchId }, getCreateMemberBody(member))
        .then((response) => {
          // 등록 성공 시
          if (response.status === 201) {
            console.log(response.data);
            // 교인 Id 할당
            const memberId = response.data.id;
            dispatch(setMember({ ...member, id: memberId }));

            // 성공 팝업
            setIsToastShow(true);
            // 다음 단계로 이동
            dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
          }
        });
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      if (type === MEMBER_REGISTER_TYPE.NEW) {
        if (member?.id) {
          membersApi.editMember(
            { churchId, memberId: member.id },
            getEditMemberBody(member),
          );
        }
      } else {
        dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
      }
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      if (member?.id) {
        membersApi.editMember(
          { churchId, memberId: member.id },
          getEditMemberBody(member),
        );
      }
    }
  };

  const getRightButtonTitle = () => {
    if (type === MEMBER_REGISTER_TYPE.NEW) {
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
