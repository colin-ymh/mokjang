import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember, setStage } from "@/redux/reducers/member-register-reducer";

import {
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";
import RegisterButtonListView from "@/components/molecules/register/register-button-list.view";
import ToastPopup from "@/components/atoms/common/popup/toast-popup";
import { MembersApi } from "@/api/members.api";
import { getPostMember } from "@/utils/member";

import { useScopedI18n } from "../../../../locales/client";
import { BLANK } from "@/common/default/default-value";

const RegisterButtonList = () => {
  const membersApi = new MembersApi(false);
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
    // 최초 화면
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      // 최초 교인 등록
      membersApi
        .createMember(
          { churchId: 1 },
          getPostMember({ ...member, gender: BLANK }),
        )
        .then((response) => {
          // 등록 성공 시
          if (response.status === 201) {
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
      if (member.type === MEMBER_REGISTER_TYPE.NEW) {
        if (member?.id) {
          membersApi.editMember(
            { churchId: 1, memberId: member.id },
            getPostMember({ ...member, name: BLANK, mobilePhone: BLANK }),
          );
        }
      } else {
        dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
      }
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      if (member?.id) {
        membersApi.editMember(
          { churchId: 1, memberId: member.id },
          getPostMember({ ...member, name: BLANK, mobilePhone: BLANK }),
        );
      }
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
