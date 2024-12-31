import { ChangeEvent, useState } from "react";

import { BLANK } from "@/constants/constant";
import { getFormattedMobilePhone, getFormattedName } from "@/utils/format";
import { AuthApi } from "@/api/auth/auth.api";
import { usePageRouter } from "@/utils/router";
import UserRegisterListView from "@/components/molecules/auth/user-register-list.view";

const UserRegisterList = () => {
  const router = usePageRouter();
  const authApi = new AuthApi(false);

  // 이름
  const [name, setName] = useState<string>(BLANK);
  // 전화번호
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);
  // 인증번호
  const [verifyNumber, setVerifyNumber] = useState<string>(BLANK);

  // 요청 여부
  const [isRequested, setIsRequested] = useState<boolean>(false);

  // 인증 여부
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // 개인정보 동의여부
  const [isConsent, setIsConsent] = useState<boolean>(false);

  // 이름 변경 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(getFormattedName(event.target.value));
  };

  // 전화번호 변경 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    setMobilePhone(getFormattedMobilePhone(event.target.value));
  };

  // 인증번호 변경 이벤트
  const onChangeVerifyNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const newVerifyNumber = event.target.value
      .replace(/\D/g, "")
      .trim()
      .slice(0, 6);
    // 숫자만 남기기
    setVerifyNumber(newVerifyNumber);
  };

  // 요청 버튼
  const onClickRequest = () => {
    authApi
      .getVerificationRequest(
        { isTest: true },
        { name, mobilePhone: mobilePhone.replace(/-/g, "") },
      )
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data);
          setIsRequested(true);
        }
      });
  };

  // 인증 버튼
  const onClickVerify = () => {
    authApi
      .getVerificationVerify({ code: verifyNumber })
      .then((response) => {
        // 성공
        if (response.data?.verified) {
          setIsVerified(true);
        }
      })
      .catch((error) => {
        setIsVerified(false);
      });
  };

  // 개인정보 처리 동의 버튼
  const onClickConsent = () => {
    setIsConsent(!isConsent);
  };

  // 회원가입 완료버튼
  const onClickDone = () => {
    router.push("");
  };
  const props = {
    name,
    mobilePhone,
    verifyNumber,
    isRequested,
    isVerified,
    isConsent,
    onChangeName,
    onChangeMobilePhone,
    onChangeVerifyNumber,
    onClickRequest,
    onClickVerify,
    onClickConsent,
    onClickDone,
  };

  return (
    <>
      <UserRegisterListView {...props} />
    </>
  );
};

export default UserRegisterList;
