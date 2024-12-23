"use client";

import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { BLACK, DESTRUCTIVE, GRAY } from "@/constants/styles/color";
import LabelInput from "@/components/atoms/common/input/label-input";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import { FAMILY, MEMBER_REGISTER_TYPE } from "@/constants/constant";
import { useMemberRegisterTypeRadioButtonItems } from "@/hooks/radio-button/radio-button-items";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { getIsWellFormedMobilePhone, getIsWellFormedName } from "@/utils/check";
import { onClickEnter } from "@/utils/input";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import { useFamilyRelationDropdownItems } from "@/hooks/dropdown/dropdown-items";

const RequiredRegisterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px;
  cursor: pointer;
`;

export type RequiredRegisterViewProps = {
  guideName: string;
  guideItems: DropdownValueType[];
  familyMemberName: string;
  familyMemberItems: DropdownValueType[];
  onChangeType: (type: MEMBER_REGISTER_TYPE) => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuideName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuidedById: (value: string) => void;
  onChangeFamilyMemberName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeFamilyMemberId: (value: string) => void;
  onChangeFamilyRelation: (value: FAMILY) => void;
};

const RequiredRegisterView = ({
  guideName,
  guideItems,
  familyMemberName,
  familyMemberItems,
  onChangeType,
  onChangeName,
  onChangeMobilePhone,
  onChangeGuideName,
  onChangeGuidedById,
  onChangeFamilyMemberName,
  onChangeFamilyMemberId,
  onChangeFamilyRelation,
}: RequiredRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const { type, member } = useSelector(
    (state: RootState) => state.memberRegister,
  );

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
        selectedValue={type}
        onChange={onChangeType}
        customButton={(props) => (
          <RegisterRadioButton {...props} color={GRAY.DARK} />
        )}
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
        borderColor={
          member.name
            ? getIsWellFormedName(member.name)
              ? BLACK
              : DESTRUCTIVE.DEFAULT
            : undefined
        }
      />
      {/* 휴대폰 번호 */}
      <LabelInput
        enterKeyHint={"done"}
        inputMode={"numeric"}
        ref={mobilePhoneInputRef}
        label={t("mobilePhone")}
        value={member.mobilePhone}
        onChange={onChangeMobilePhone}
        placeholder={t_placeholder("mobilePhone")}
        onKeyDown={(event) => onClickEnter(event, guideInputRef)}
        borderColor={
          member.mobilePhone
            ? getIsWellFormedMobilePhone(member.mobilePhone)
              ? BLACK
              : DESTRUCTIVE.DEFAULT
            : undefined
        }
      />
      {/* 인도자 */}
      <LabelDropdown
        enterKeyHint={"done"}
        ref={guideInputRef}
        label={t("guide")}
        value={guideName}
        items={guideItems}
        onChange={onChangeGuideName}
        onChangeItem={onChangeGuidedById}
        placeholder={t_placeholder("guide")}
        isEditable={true}
        onKeyDown={(event) => onClickEnter(event, familyInputRef)}
      />
      {/* 가족 */}
      <LabelDropdown
        enterKeyHint={"done"}
        ref={familyInputRef}
        label={t("family")}
        value={familyMemberName}
        items={familyMemberItems}
        onChange={onChangeFamilyMemberName}
        onChangeItem={onChangeFamilyMemberId}
        placeholder={t_placeholder("family")}
        isEditable={true}
        onKeyDown={onClickEnter}
        reverseDirection={true}
      />
      {/* 가족관계 */}
      <LabelDropdown
        label={t("relation")}
        value={member.relation}
        items={useFamilyRelationDropdownItems()}
        onChangeItem={onChangeFamilyRelation}
        reverseDirection={true}
      />
    </RequiredRegisterContainer>
  );
};

export default RequiredRegisterView;
