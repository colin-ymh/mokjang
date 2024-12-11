"use client";

import React, { ChangeEvent, RefObject, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import LabelInput from "@/components/atoms/common/input/label-input";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import LabelRadioButton from "@/components/atoms/common/input/radio-button/label-radio-button";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { useMarriageDropdownItems } from "@/hooks/dropdown/dropdown-items";
import VehicleNumberInput from "@/components/atoms/register/vehicle-number-input";
import { VehicleNumberInputRef } from "@/components/atoms/register/vehicle-number-input.view";
import MemberImageInput from "@/components/atoms/register/member-image-input";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import {
  CALENDAR_MODE,
  MARRIAGE,
  MEDIA_MIN_WIDTH,
  NULL,
} from "@/constants/constant";
import {
  useCalendarModeRadioButtonItems,
  useGenderRadioButtonItems,
} from "@/hooks/radio-button/radio-button-items";

import { getTrimmedString } from "@/utils/format";
import { getDateFromString, getIsChild } from "@/utils/date";
import { onClickEnter } from "@/utils/input";

import { useI18n, useScopedI18n } from "../../../../locales/client";
import { usePathname } from "next/navigation";
import { getIsWellFormedBirth, getIsWellFormedHomePhone } from "@/utils/check";
import { BLACK, DESTRUCTIVE } from "@/constants/styles/color";

const PersonalRegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const ImageGenderBirthContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    flex-direction: row;
  }
`;

const GenderBirthContainer = styled(PersonalRegisterContainer)``;

const BirthContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const InputContainer = styled(PersonalRegisterContainer)`
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;

    /* 각 input을 두 개씩 한 줄에 배치 */
    > div {
      flex: 1;
      min-width: calc(
        50% - 10px
      ); /* 두 개씩 배치되도록 50% 크기로 설정, 간격을 고려하여 10px만큼 빼줌 */
    }
  }
`;

const SchoolOccupationContainer = styled(PersonalRegisterContainer)<{
  $isSchoolShow: boolean;
}>`
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    ${({ $isSchoolShow }) =>
      $isSchoolShow &&
      `
        flex-direction: row-reverse;
        flex-wrap: wrap;
        gap: 20px;

        > div {
          flex: 1;
          min-width: calc(50% - 10px); 
        }
      `}
  }
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
  onChangeMarriage: (value: MARRIAGE) => void;
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

  const { member } = useSelector((state: RootState) => state.memberRegister);

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
    <PersonalRegisterContainer>
      <ImageGenderBirthContainer>
        {/* 프로필 이미지*/}
        <MemberImageInput
          value={member.profileImage}
          onChange={onChangeProfileImage}
        />
        <GenderBirthContainer>
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
              value={member.birth}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const isChild = getIsChild(
                  getDateFromString(event.target.value),
                );
                onChangeBirth(
                  event,
                  isChild ? schoolInputRef : occupationInputRef,
                );
              }}
              placeholder={t_placeholder("birth")}
              borderColor={
                member.birth
                  ? getIsWellFormedBirth(member.birth)
                    ? BLACK
                    : DESTRUCTIVE.DEFAULT
                  : undefined
              }
            />
            {/* 양력 음력 */}
            <RadioButton
              items={useCalendarModeRadioButtonItems()}
              selectedValue={
                member.isLunar ? CALENDAR_MODE.LUNAR : CALENDAR_MODE.SOLAR
              }
              onChange={onChangeCalendarMode}
              customButton={RegisterRadioButton}
            />
          </BirthContainer>
        </GenderBirthContainer>
      </ImageGenderBirthContainer>
      <SchoolOccupationContainer
        $isSchoolShow={getIsChild(getDateFromString(member.birth))}
      >
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
            borderColor={getTrimmedString(member.school) ? BLACK : undefined}
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
          borderColor={getTrimmedString(member.occupation) ? BLACK : undefined}
        />
      </SchoolOccupationContainer>
      <InputContainer>
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
          borderColor={member.marriage !== NULL ? BLACK : undefined}
        />
        {/* 결혼 상세 정보 */}
        {/* 새신자 측에서는 보이지 않는 부분 */}
        {!usePathname().includes("/extra") && (
          <LabelInput
            enterKeyHint={"done"}
            ref={detailMarriageInputRef}
            label={t("detailMarriage")}
            value={member.detailMarriage}
            onChange={onChangeDetailMarriage}
            placeholder={t_placeholder("detailMarriage")}
            borderColor={
              getTrimmedString(member.detailMarriage) ? BLACK : undefined
            }
          />
        )}
        {/* 도로명주소 */}
        <LabelInput
          enterKeyHint={"done"}
          ref={addressInputRef}
          label={t("address")}
          value={member.address}
          placeholder={t_placeholder("address")}
          onClick={onClickAddress}
          borderColor={getTrimmedString(member.address) ? BLACK : undefined}
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
          borderColor={
            getTrimmedString(member.detailAddress) ? BLACK : undefined
          }
        />
        {/* 전화 번호 */}
        <LabelInput
          ref={homePhoneInputRef}
          inputMode={"numeric"}
          label={t("homePhone")}
          value={member.homePhone}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChangeHomePhone(event, vehicleInputRef?.current?.firstInputRef)
          }
          placeholder={t_placeholder("homePhone")}
          borderColor={
            member.homePhone
              ? getIsWellFormedHomePhone(member.homePhone)
                ? BLACK
                : DESTRUCTIVE.DEFAULT
              : undefined
          }
        />
      </InputContainer>
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
    </PersonalRegisterContainer>
  );
};

export default PersonalRegisterView;
