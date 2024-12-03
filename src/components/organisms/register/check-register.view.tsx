import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";

import LabelInput from "@/components/atoms/common/input/label-input";
import { useI18n, useScopedI18n } from "../../../../locales/client";
import Button from "@/components/atoms/common/button/button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN } from "@/common/styles/color";

import { getFormattedMobilePhone, getFormattedName } from "@/utils/format";
import { onClickEnter } from "@/utils/input";
import { MEDIA_MIN_WIDTH } from "@/constant/constant";

const CheckRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  justify-content: center;
  align-items: center;
  background-color: ${GRAY.BACKGROUND};

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    padding: 10% 30%;
  }
`;

const HeaderTextContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 20px 0 30px 0;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 50px;
`;

type CheckRegisterViewProps = {
  name: string;
  mobilePhone: string;
  isButtonEnable: boolean;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickButton: () => void;
};

const CheckRegisterView = ({
  name,
  mobilePhone,
  isButtonEnable,
  onChangeName,
  onChangeMobilePhone,
  onClickButton,
}: CheckRegisterViewProps) => {
  const t = useI18n();
  const t_register = useScopedI18n("register");
  const t_placeholder = useScopedI18n("placeholder");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);

  return (
    <CheckRegisterContainer>
      <HeaderTextContainer>
        <MainText fontSize={23} fontWeight={500}>
          {t_register("checkRegisterPhrase")}
        </MainText>
      </HeaderTextContainer>
      <InputContainer>
        {/* 이름 */}
        <LabelInput
          enterKeyHint={"done"}
          ref={nameInputRef}
          label={t("name")}
          value={getFormattedName(name)}
          onChange={onChangeName}
          placeholder={t_placeholder("name")}
          onKeyDown={(event) => onClickEnter(event, mobilePhoneInputRef)}
        />
        {/* 휴대폰 번호 */}
        <LabelInput
          enterKeyHint={"done"}
          inputMode={"numeric"}
          ref={mobilePhoneInputRef}
          label={t("mobilePhone")}
          value={getFormattedMobilePhone(mobilePhone)}
          onChange={onChangeMobilePhone}
          placeholder={t_placeholder("mobilePhone")}
        />
      </InputContainer>

      <ButtonContainer>
        <Button
          text={t_register("checkButton")}
          disabled={!isButtonEnable}
          backgroundColor={isButtonEnable ? MAIN.DEFAULT : GRAY.DEFAULT}
          onClick={onClickButton}
        />
      </ButtonContainer>
    </CheckRegisterContainer>
  );
};

export default CheckRegisterView;
