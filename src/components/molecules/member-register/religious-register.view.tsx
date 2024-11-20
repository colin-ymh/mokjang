"use client";

import React, { ChangeEvent } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";

import { getFormattedDate } from "@/utils/format";
import { TemporalMember } from "@/models/register/member-register";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import { useBaptismDropdownItems } from "@/constant/dropdown/dropdown-items";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { BAPTISM } from "@/constant/constant";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export type ReligiousRegisterViewProps = {
  onChangeConfirmation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeConfirmationStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeConfirmationStartChurch: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onChangeBaptism: (value: BAPTISM) => void;
  onChangePreviousChurchName: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ReligiousRegisterView = ({
  onChangeConfirmation,
  onChangeConfirmationStartDate,
  onChangeConfirmationStartChurch,
  onChangeBaptism,
  onChangePreviousChurchName,
}: ReligiousRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

  return (
    <InputContainer>
      {/* 신급 */}
      <LabelDropdown
        label={t("baptism")}
        value={member.baptism}
        items={useBaptismDropdownItems()}
        onChange={onChangeBaptism}
      />
      {/* 직분 */}
      <LabelInput
        label={t("confirmation")}
        value={member.confirmation}
        onChange={onChangeConfirmation}
        placeholder={t_placeholder("confirmation")}
      />
      {/* 임직일 */}
      <LabelInput
        label={t("confirmationStartDate")}
        value={getFormattedDate(member.confirmationStartDate)}
        onChange={onChangeConfirmationStartDate}
        placeholder={t_placeholder("confirmationStartDate")}
      />
      {/* 임직 교회 */}
      <LabelInput
        label={t("confirmationStartChurch")}
        value={member.confirmationStartChurch}
        onChange={onChangeConfirmationStartChurch}
        placeholder={t_placeholder("confirmationStartChurch")}
      />
      {/* 이전 교회 */}
      <LabelInput
        label={t("previousChurchName")}
        value={member.previousChurchName}
        onChange={onChangePreviousChurchName}
        placeholder={t_placeholder("previousChurchName")}
      />
    </InputContainer>
  );
};

export default ReligiousRegisterView;
