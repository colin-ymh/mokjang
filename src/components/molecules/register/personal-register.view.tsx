"use client";

import React, { ChangeEvent, RefObject, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import LabelRadioButton from "@/components/atoms/common/input/radio-button/label-radio-button";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { useMarriageDropdownItems } from "@/constant/dropdown/dropdown-items";
import VehicleNumberInput from "@/components/atoms/register/vehicle-number-input";
import { VehicleNumberInputRef } from "@/components/atoms/register/vehicle-number-input.view";
import MemberImageInput from "@/components/atoms/register/member-image-input";

import {
  useBirthRadioButtonItems,
  useGenderRadioButtonItems,
} from "@/constant/radio-button/radio-button-items";

import { getFormattedDate, getFormattedHomePhone } from "@/utils/format";
import { getDateFromString, getIsChild } from "@/utils/date";
import { onClickEnter } from "@/utils/input";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import { CALENDAR_MODE } from "@/constant/constant";

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const BirthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const SchoolInputWrapper = styled.div`
  width: 100%;
  opacity: 0;
  height: 0;
  margin-bottom: -20px;
  z-index: 0;
`;

const Invisible = styled.div`
  height: 100px;
  width: 5px;
`;

export type PersonalRegisterViewProps = {
  schoolAnimationRef: RefObject<HTMLDivElement>;
  schoolItems: DropdownValueType[];
  onChangeProfileImage: (image: string) => void;
  onChangeBirth: (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => void;
  onChangeCalendarMode: (value: CALENDAR_MODE) => void;
  onChangeHomePhone: (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => void;
  onChangeOccupation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDetailAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSchool: (
    value: string,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => void;
  onChangeVehicleNumber: (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onChangeMarriage: (
    value: string,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => void;
  onClickMarriageDropdownItem: (
    nextInputRef: RefObject<HTMLInputElement>,
  ) => void;
  onChangeDetailMarriage: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (gender: string) => void;
  onClickAddress: () => void;
};

const PersonalRegisterView = ({
  schoolAnimationRef,
  schoolItems,
  onChangeProfileImage,
  onChangeBirth,
  onChangeCalendarMode,
  onChangeHomePhone,
  onChangeOccupation,
  onChangeMarriage,
  onClickMarriageDropdownItem,
  onChangeDetailMarriage,
  onChangeDetailAddress,
  onChangeSchool,
  onChangeGender,
  onChangeVehicleNumber,
  onClickAddress,
}: PersonalRegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const { member, stage } = useSelector(
    (state: RootState) => state.memberRegister,
  );

  // 각 input 에 대한 ref
  const birthInputRef = useRef<HTMLInputElement>(null);
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const occupationInputRef = useRef<HTMLInputElement>(null);
  const marriageInputRef = useRef<HTMLInputElement>(null);
  const detailMarriageInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const detailAddressInputRef = useRef<HTMLInputElement>(null);
  const homePhoneInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<VehicleNumberInputRef>(null);

  return (
    <InputContainer>
      {/* 프로필 이미지*/}
      <MemberImageInput
        value={member.profileImage}
        onChange={onChangeProfileImage}
      />
      {/* 성별 */}
      <LabelRadioButton
        label={t("gender")}
        items={useGenderRadioButtonItems()}
        selectedValue={member.gender}
        onChange={onChangeGender}
        customButton={RegisterRadioButton}
      />

      {/* 생년월일 */}
      <BirthContainer>
        {/* 생년월일 입력창 */}
        <LabelInput
          ref={birthInputRef}
          inputMode={"numeric"}
          label={t("birth")}
          value={getFormattedDate(member.birth)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const isChild = getIsChild(getDateFromString(event.target.value));
            onChangeBirth(event, isChild ? schoolInputRef : occupationInputRef);
          }}
          placeholder={t_placeholder("birth")}
        />
        {/* 양력 음력 */}
        <RadioButton
          items={useBirthRadioButtonItems()}
          selectedValue={
            member.isLunar ? CALENDAR_MODE.LUNAR : CALENDAR_MODE.SOLAR
          }
          onChange={onChangeCalendarMode}
          customButton={RegisterRadioButton}
        />
      </BirthContainer>
      {/* 학교 (미성년자인 경우에만 나타남) */}
      <SchoolInputWrapper ref={schoolAnimationRef}>
        <LabelDropdown
          enterKeyHint={"done"}
          ref={schoolInputRef}
          label={t("school")}
          items={schoolItems}
          value={member.school}
          onChangeItem={(value) => onChangeSchool(value, occupationInputRef)}
          placeholder={t_placeholder("school")}
          isEditable={true}
          onKeyDown={(event) => onClickEnter(event, occupationInputRef)}
        />
      </SchoolInputWrapper>
      {/* 직업 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={occupationInputRef}
        label={t("occupation")}
        value={member.occupation}
        onChange={onChangeOccupation}
        placeholder={t_placeholder("occupation")}
        onKeyDown={(event) => onClickEnter(event, marriageInputRef)}
        zIndex={1}
      />
      {/* 결혼 */}
      <LabelDropdown
        ref={marriageInputRef}
        label={t("marriage")}
        value={member.marriage}
        items={useMarriageDropdownItems()}
        onChangeItem={onChangeMarriage}
        onClickItemExtra={() => {
          onClickMarriageDropdownItem(detailMarriageInputRef);
        }}
        placeholder={t_placeholder("marriage")}
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
          onClickEnter(event, detailMarriageInputRef)
        }
      />
      {/* 결혼 상세 정보 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={detailMarriageInputRef}
        label={t("detailMarriage")}
        value={member.detailMarriage}
        onChange={onChangeDetailMarriage}
        placeholder={t_placeholder("detailMarriage")}
      />
      {/* 도로명주소 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={addressInputRef}
        label={t("address")}
        value={member.address}
        placeholder={t_placeholder("address")}
        onClick={onClickAddress}
      />
      {/* 상세주소 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={detailAddressInputRef}
        label={t("detailAddress")}
        value={member.detailAddress}
        onChange={onChangeDetailAddress}
        placeholder={t_placeholder("detailAddress")}
        onKeyDown={(event) => onClickEnter(event, homePhoneInputRef)}
      />
      {/* 전화 번호 */}
      <LabelInput
        ref={homePhoneInputRef}
        inputMode={"numeric"}
        label={t("homePhone")}
        value={getFormattedHomePhone(member.homePhone)}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChangeHomePhone(event, vehicleInputRef?.current?.firstInputRef)
        }
        placeholder={t_placeholder("homePhone")}
      />
      {/* 차량 번호 */}
      <VehicleNumberInput
        enterKeyHint={"done"}
        ref={vehicleInputRef}
        label={t("vehicleNumber")}
        value={member.vehicleNumber}
        onChangeInput={onChangeVehicleNumber}
        placeholder={t_placeholder("vehicleNumber")}
        onKeyDown={onClickEnter}
      />
      <Invisible />
    </InputContainer>
  );
};

export default PersonalRegisterView;
