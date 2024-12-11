"use client";

import React, { ChangeEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";
import {
  useBaptismDropdownItems,
  useOfficerDropdownItems,
} from "@/hooks/dropdown/dropdown-items";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { BAPTISM, NULL } from "@/constants/constant";
import { BLACK, DESTRUCTIVE } from "@/constants/styles/color";
import { getTrimmedString } from "@/utils/format";
import { onClickEnter } from "@/utils/input";
import { getIsWellFormedBirth } from "@/utils/check";

import { useI18n, useScopedI18n } from "../../../../locales/client";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export type ReligiousRegisterViewProps = {
  onChangeOfficer: (value: string) => void;
  onChangeOfficerStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeOfficerStartChurch: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBaptism: (value: BAPTISM) => void;
  onChangePreviousChurchName: (event: ChangeEvent<HTMLInputElement>) => void;
};

const OfficerWrapper = styled.div`
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
  onChangeOfficer,
  onChangeOfficerStartDate,
  onChangeOfficerStartChurch,
  onChangeBaptism,
  onChangePreviousChurchName,
}: ReligiousRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const { member, stage } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  // input refs
  const officerDateInputRef = useRef<HTMLInputElement>(null);
  const officerChurchInputRef = useRef<HTMLInputElement>(null);
  const previousChurchInputRef = useRef<HTMLInputElement>(null);

  // 학교 input 창 애니메이션 효과
  const officerAnimationRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (officerAnimationRef.current) {
      if (member.officerId !== NULL) {
        // 직분이 있는 경우
        gsap.to(officerAnimationRef.current, {
          opacity: 1,
          height: "auto",
          marginBottom: 0,
          duration: 0.3,
          ease: "power1.inOut",
          display: "flex",
        });
      } else {
        // 직분이 없는 경우
        gsap.to(officerAnimationRef.current, {
          opacity: 0,
          height: 0,
          marginBottom: -20,
          duration: 0.3,
          ease: "power1.inOut",
          display: "none",
        });
      }
    }
  }, [member.officerId]);

  return (
    <InputContainer>
      {/* 신급 */}
      <LabelDropdown
        label={t("baptism")}
        value={member.baptism}
        items={useBaptismDropdownItems()}
        onChangeItem={onChangeBaptism}
        borderColor={member.baptism !== BAPTISM.NONE ? BLACK : undefined}
      />
      {/* 직분 */}
      <LabelDropdown
        label={t("officer")}
        value={member.officerId}
        items={useOfficerDropdownItems()}
        onChangeItem={onChangeOfficer}
        borderColor={member.officerId !== NULL ? BLACK : undefined}
      />
      <OfficerWrapper ref={officerAnimationRef}>
        {/* 임직일 */}
        <LabelInput
          ref={officerDateInputRef}
          enterKeyHint={"done"}
          label={t("officerStartDate")}
          value={member.officerStartDate}
          onChange={onChangeOfficerStartDate}
          placeholder={t_placeholder("officerStartDate")}
          onKeyDown={(event) => onClickEnter(event, officerChurchInputRef)}
          borderColor={
            member.officerStartDate
              ? getIsWellFormedBirth(member.officerStartDate)
                ? BLACK
                : DESTRUCTIVE.DEFAULT
              : undefined
          }
        />
        {/* 임직 교회 */}
        <LabelInput
          ref={officerChurchInputRef}
          enterKeyHint={"done"}
          label={t("officerStartChurch")}
          value={member.officerStartChurch}
          onChange={onChangeOfficerStartChurch}
          placeholder={t_placeholder("officerStartChurch")}
          onKeyDown={(event) => onClickEnter(event, previousChurchInputRef)}
          borderColor={
            getTrimmedString(member.officerStartChurch) ? BLACK : undefined
          }
        />
      </OfficerWrapper>
      {/* 이전 교회 */}
      <LabelInput
        ref={previousChurchInputRef}
        enterKeyHint={"done"}
        label={t("previousChurchName")}
        value={member.previousChurchName}
        onChange={onChangePreviousChurchName}
        placeholder={t_placeholder("previousChurchName")}
        onKeyDown={onClickEnter}
        borderColor={
          getTrimmedString(member.previousChurchName) ? BLACK : undefined
        }
      />
      <Invisible />
    </InputContainer>
  );
};

export default ReligiousRegisterView;
