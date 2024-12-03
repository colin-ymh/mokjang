"use client";

import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { GRAY } from "@/common/styles/color";
import LabelInput from "@/components/atoms/common/input/label-input";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import { MEDIA_MIN_WIDTH, MEMBER_REGISTER_TYPE } from "@/constant/constant";
import { useMemberRegisterTypeRadioButtonItems } from "@/constant/radio-button/radio-button-items";

import { getFormattedMobilePhone, getFormattedName } from "@/utils/format";
import { onClickEnter } from "@/utils/input";

import { useI18n, useScopedI18n } from "../../../../locales/client";

const Invisible = styled.div`
  height: 100px;
`;

const RequiredRegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const InputContainer = styled(RequiredRegisterContainer)`
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;

    /* 각 input을 두 개씩 한 줄에 배치 */
    > div {
      flex: 1;
      min-width: calc(
        50% - 10px
      ); /* 두 개씩 배치되도록 50% 크기로 설정, 간격을 고려하여 10px만큼 빼줌 */
    }
  }
`;

export type RequiredRegisterViewProps = {
  onChangeType: (type: MEMBER_REGISTER_TYPE) => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuide: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeFamily: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RequiredRegisterView = ({
  onChangeType,
  onChangeName,
  onChangeMobilePhone,
  onChangeGuide,
  onChangeFamily,
}: RequiredRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const { member } = useSelector((state: RootState) => state.memberRegister);

  // 각 input 에 대한 ref
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);
  const familyInputRef = useRef<HTMLInputElement>(null);

  return (
    <RequiredRegisterContainer>
      {/* 종류 */}
      <RadioButton
        items={useMemberRegisterTypeRadioButtonItems()}
        selectedValue={member.type}
        onChange={onChangeType}
        customButton={(props) => (
          <RegisterRadioButton {...props} color={GRAY.DARK} />
        )}
      />
      <InputContainer>
        {/* 이름 */}
        <LabelInput
          enterKeyHint={"done"}
          ref={nameInputRef}
          label={t("name")}
          value={getFormattedName(member.name)}
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
          value={getFormattedMobilePhone(member.mobilePhone)}
          onChange={onChangeMobilePhone}
          placeholder={t_placeholder("mobilePhone")}
          onKeyDown={(event) => onClickEnter(event, guideInputRef)}
        />
        {/* 인도자 */}
        <LabelInput
          enterKeyHint={"done"}
          ref={guideInputRef}
          label={t("guide")}
          value={member.guide}
          onChange={onChangeGuide}
          placeholder={t_placeholder("guide")}
          onKeyDown={(event) => onClickEnter(event, familyInputRef)}
        />
        {/* 가족 */}
        <LabelInput
          enterKeyHint={"done"}
          ref={familyInputRef}
          label={t("family")}
          value={member.family}
          onChange={onChangeFamily}
          placeholder={t_placeholder("family")}
          onKeyDown={onClickEnter}
        />
      </InputContainer>
      <Invisible />
    </RequiredRegisterContainer>
  );
};

export default RequiredRegisterView;
