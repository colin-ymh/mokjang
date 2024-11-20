"use client";

import React, { ChangeEvent } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";

import { getFormattedDate, getFormattedHomePhone } from "@/utils/format";
import { TemporalMember } from "@/models/register/member-register";

import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import {
  useGenderRadioButtonItems,
  useMemberRegisterTypeRadioButtonItems,
} from "@/constant/radio-button/radio-button-items";
import RegisterRadioButton from "@/components/atoms/member-register/register-radio-button";
import LabelRadioButton from "@/components/atoms/common/input/radio-button/label-radio-button";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export type PersonalRegisterViewProps = {
  onChangeBirth: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeHomePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeOccupation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSchool: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeVehiclePlateNumber: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMarriage: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (gender: string) => void;
};

const PersonalRegisterView = ({
  onChangeBirth,
  onChangeHomePhone,
  onChangeOccupation,
  onChangeMarriage,
  onChangeAddress,
  onChangeSchool,
  onChangeGender,
  onChangeVehiclePlateNumber,
}: PersonalRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

  return (
    <InputContainer>
      {/* 생년월일 */}
      <LabelInput
        label={t("birth")}
        value={getFormattedDate(member.birth)}
        onChange={onChangeBirth}
        placeholder={t_placeholder("birth")}
      />
      {/* 성별 */}
      <LabelRadioButton
        label={t("gender")}
        items={useGenderRadioButtonItems()}
        selectedValue={member.gender}
        onChange={onChangeGender}
        customButton={RegisterRadioButton}
      />
      {/* 직업 */}
      <LabelInput
        label={t("occupation")}
        value={member.occupation}
        onChange={onChangeOccupation}
        placeholder={t_placeholder("occupation")}
      />
      {/* 결혼 */}
      <LabelInput
        label={t("marriage")}
        value={member.marriage}
        onChange={onChangeMarriage}
        placeholder={t_placeholder("marriage")}
      />
      {/* 도로명주소 */}
      <LabelInput
        label={t("address")}
        value={member.address}
        onChange={onChangeAddress}
        placeholder={t_placeholder("address")}
      />
      {/* 전화 번호 */}
      <LabelInput
        label={t("homePhone")}
        value={getFormattedHomePhone(member.homePhone)}
        onChange={onChangeHomePhone}
        placeholder={t_placeholder("homePhone")}
      />
      {/*/!* 학교 *!/*/}
      {/*<LabelInput*/}
      {/*  label={t("school")}*/}
      {/*  value={member.school}*/}
      {/*  onChange={onChangeSchool}*/}
      {/*  placeholder={t_placeholder("school")}*/}
      {/*/>*/}
      {/* 차량 번호 */}
      <LabelInput
        label={t("vehiclePlateNumber")}
        value={member.vehiclePlateNumber}
        onChange={onChangeVehiclePlateNumber}
        placeholder={t_placeholder("vehiclePlateNumber")}
      />
    </InputContainer>
  );
};

export default PersonalRegisterView;
