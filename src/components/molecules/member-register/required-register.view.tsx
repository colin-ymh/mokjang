"use client";

import React, { ChangeEvent, RefObject, useRef } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";
import { TemporalMember } from "@/models/register/member-register";

import { getFormattedMobilePhone } from "@/utils/format";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import RegisterRadioButton from "@/components/atoms/member-register/register-radio-button";
import { useMemberRegisterTypeRadioButtonItems } from "@/constant/radio-button/radio-button-items";
import { MEMBER_REGISTER_TYPE } from "@/constant/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import LabelRadioButton from "@/components/atoms/common/input/radio-button/label-radio-button";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export type CommonRegisterProps = {
  onClickEnter: (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextInputRef: RefObject<HTMLInputElement>,
  ) => void;
};

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
  onClickEnter,
}: RequiredRegisterViewProps & CommonRegisterProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

  // 각 input에 대한 ref
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);
  const familyInputRef = useRef<HTMLInputElement>(null);

  return (
    <InputContainer>
      {/* 종류 */}
      <LabelRadioButton
        label={t("type")}
        items={useMemberRegisterTypeRadioButtonItems()}
        selectedValue={member.type}
        onChange={onChangeType}
        customButton={RegisterRadioButton}
      />
      {/* 이름 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={nameInputRef}
        label={t("name")}
        value={member.name}
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
      />
    </InputContainer>
  );
};

export default RequiredRegisterView;
