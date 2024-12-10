"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CheckRegisterView from "@/components/organisms/register/check-register.view";
import { BLANK } from "@/constants/constant";
import { RequestInfoApi } from "@/api/churches/request-info.api";
import { getFormattedMobilePhone, getFormattedName } from "@/utils/format";
import { usePageRouter } from "@/utils/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";
import { Member } from "@/models/member/member";

const CheckRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const member: Member = useSelector(
    (state: RootState): Member => state.memberRegister.member,
  );
  const router = usePageRouter();
  const { churchId, requestInfoId } = useParams() as {
    churchId: string;
    requestInfoId: string;
  };
  const requestInfoApi = new RequestInfoApi(false);

  // 버튼 활성화 여부
  const [isButtonEnable, setIsButtonEnable] = useState<boolean>(false);

  // 이름과 전화번호가 모두 존재해야 활성화
  useEffect(() => {
    setIsButtonEnable(
      member.name !== BLANK && member.mobilePhone.length === 13,
    );
  }, [member]);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    dispatch(setMember({ ...member, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = getFormattedMobilePhone(event.target.value);
    dispatch(setMember({ ...member, mobilePhone: newMobilePhone }));

    // 전화번호를 다 입력한 경우
    if (newMobilePhone.length > 12) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 확인 버튼 이벤트
  const onClickButton = () => {
    // 서버를 통해 유효성 검증
    requestInfoApi
      .getRequestValidation(
        { churchId, requestInfoId },
        {
          name: member.name,
          mobilePhone: member.mobilePhone.replace(/\D/g, ""),
        },
      )
      .then((response) => {
        if (response.data.success) {
          // 검증 완료 시
          router.push(`/churches/${churchId}/request/${requestInfoId}/extra`);
        } else {
          // 실패 처리
        }
      });
  };

  const props = {
    isButtonEnable,
    onChangeName,
    onChangeMobilePhone,
    onClickButton,
  };

  return (
    <>
      <CheckRegisterView {...props} />
    </>
  );
};

export default CheckRegister;
