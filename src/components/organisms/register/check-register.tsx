"use client";
import { ChangeEvent, RefObject, useEffect, useState } from "react";

import CheckRegisterView from "@/components/organisms/register/check-register.view";
import { BLANK } from "@/common/default/default-value";
import { usePageRouter } from "@/utils/router";

const CheckRegister = () => {
  const router = usePageRouter();

  const [name, setName] = useState<string>("");
  const [mobilePhone, setMobilePhone] = useState<string>("");

  // 버튼 활성화 여부
  const [isButtonEnable, setIsButtonEnable] = useState<boolean>(false);

  // 이름과 전화번호가 모두 존재해야 활성화
  useEffect(() => {
    setIsButtonEnable(name !== BLANK && mobilePhone.length === 13);
  }, [name, mobilePhone]);

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMobilePhone = event.target.value;
    setMobilePhone(newMobilePhone);

    // 전화번호를 다 입력한 경우
    if (newMobilePhone.length > 12) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 확인 버튼 이벤트
  const onClickButton = () => {
    // 서버를 통해 유효성 검증
    // 검증 완료 시
    router.push("/register/extra");
  };

  const props = {
    name,
    mobilePhone,
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
