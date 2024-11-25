"use client";

import React, { ChangeEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";

import { getFormattedDate } from "@/utils/format";
import { TemporalMember } from "@/models/register/member-register";

import {
  useBaptismDropdownItems,
  useConfirmationDropdownItems,
} from "@/constant/dropdown/dropdown-items";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { BAPTISM, CONFIRMATION } from "@/constant/constant";

import { useI18n, useScopedI18n } from "../../../../locales/client";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export type ReligiousRegisterViewProps = {
  onChangeConfirmation: (value: string) => void;
  onChangeConfirmationStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeConfirmationStartChurch: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  onChangeBaptism: (value: BAPTISM) => void;
  onChangePreviousChurchName: (event: ChangeEvent<HTMLInputElement>) => void;
};

const ConfirmationWrapper = styled.div`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  opacity: 0;
  height: 0;
  margin-bottom: -20px;
  display: none;
  gap: 20px;
`;

const Invisible = styled.div`
  height: 100px;
`;

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

  // 학교 input 창 애니메이션 효과
  const confirmationAnimationRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (confirmationAnimationRef.current) {
      if (member.confirmation !== CONFIRMATION.NONE) {
        // 직분이 있는 경우
        gsap.to(confirmationAnimationRef.current, {
          opacity: 1,
          height: "auto",
          marginBottom: 0,
          duration: 0.3,
          ease: "power1.inOut",
          display: "flex",
        });
      } else {
        // 직분이 없는 경우
        gsap.to(confirmationAnimationRef.current, {
          opacity: 0,
          height: 0,
          marginBottom: -20,
          duration: 0.3,
          ease: "power1.inOut",
          display: "none",
        });
      }
    }
  }, [member.confirmation]);

  return (
    <InputContainer>
      {/* 신급 */}
      <LabelDropdown
        label={t("baptism")}
        value={member.baptism}
        items={useBaptismDropdownItems()}
        onChangeItem={onChangeBaptism}
      />
      {/* 직분 */}
      <LabelDropdown
        label={t("confirmation")}
        value={member.confirmation}
        items={useConfirmationDropdownItems()}
        onChangeItem={onChangeConfirmation}
      />
      <ConfirmationWrapper ref={confirmationAnimationRef}>
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
      </ConfirmationWrapper>
      {/* 이전 교회 */}
      <LabelInput
        label={t("previousChurchName")}
        value={member.previousChurchName}
        onChange={onChangePreviousChurchName}
        placeholder={t_placeholder("previousChurchName")}
      />
      <Invisible />
    </InputContainer>
  );
};

export default ReligiousRegisterView;
