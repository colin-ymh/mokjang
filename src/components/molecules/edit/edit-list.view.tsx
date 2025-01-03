import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import {
  useCalendarModeRadioButtonItems,
  useGenderRadioButtonItems,
} from "@/hooks/radio-button/radio-button-items";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import { BLACK, DESTRUCTIVE } from "@/constants/styles/color";
import LabelInput from "@/components/atoms/common/input/label-input";
import {
  getIsWellFormedBirth,
  getIsWellFormedHomePhone,
  getIsWellFormedMobilePhone,
  getIsWellFormedName,
} from "@/utils/check";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { useMarriageDropdownItems } from "@/hooks/dropdown/dropdown-items";
import React, { ChangeEvent, useEffect, useRef } from "react";
import { useI18n, useScopedI18n } from "../../../../locales/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import styled from "styled-components";
import MemberImageInput from "@/components/atoms/register/member-image-input";
import LabelRadioButton from "@/components/atoms/common/input/radio-button/label-radio-button";
import { CALENDAR_MODE, GENDER, MARRIAGE, NULL } from "@/constants/constant";
import { getTrimmedString } from "@/utils/format";
import { usePathname } from "next/navigation";
import VehicleNumberInput from "@/components/atoms/register/vehicle-number-input";
import { VehicleNumberInputRef } from "@/components/atoms/register/vehicle-number-input.view";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { MEMBER } from "@/constants/member/member-column";

const RequiredRegisterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
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

const Invisible = styled.div`
  height: 100px;
`;

type EditListViewProps = {
  focusItem: MEMBER;
  guideName: string;
  guideItems: DropdownValueType[];
  schoolItems: DropdownValueType[];
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeMobilePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuideName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGuidedById: (value: string) => void;
  onChangeProfileImage: (image: string) => void;
  onChangeBirth: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeCalendarMode: (mode: CALENDAR_MODE) => void;
  onChangeHomePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeOccupation: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDetailAddress: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSchool: (value: string) => void;
  onChangeVehicleNumber: (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  onChangeMarriage: (value: MARRIAGE) => void;
  onChangeDetailMarriage: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeGender: (value: GENDER) => void;
  onClickAddress: () => void;
};

const EditListView = ({
  focusItem,
  guideName,
  guideItems,
  schoolItems,
  onChangeName,
  onChangeMobilePhone,
  onChangeGuideName,
  onChangeGuidedById,
  onChangeProfileImage,
  onChangeBirth,
  onChangeCalendarMode,
  onChangeHomePhone,
  onChangeOccupation,
  onChangeDetailAddress,
  onChangeSchool,
  onChangeVehicleNumber,
  onChangeMarriage,
  onChangeDetailMarriage,
  onChangeGender,
  onClickAddress,
}: EditListViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");

  const { member } = useSelector((state: RootState) => state.memberRegister);

  // 각 input 에 대한 ref
  const nameInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);
  const guideInputRef = useRef<HTMLInputElement>(null);
  const birthInputRef = useRef<HTMLInputElement>(null);
  const schoolInputRef = useRef<HTMLInputElement>(null);
  const occupationInputRef = useRef<HTMLInputElement>(null);
  const marriageInputRef = useRef<HTMLInputElement>(null);
  const detailMarriageInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const detailAddressInputRef = useRef<HTMLInputElement>(null);
  const homePhoneInputRef = useRef<HTMLInputElement>(null);
  const vehicleInputRef = useRef<VehicleNumberInputRef>(null);

  useEffect(() => {
    switch (focusItem) {
      case MEMBER.NAME:
        if (nameInputRef.current) nameInputRef.current.focus();
        break;
      case MEMBER.MOBILE_PHONE:
        if (mobilePhoneInputRef.current) mobilePhoneInputRef.current.focus();
        break;
      case MEMBER.GUIDED_BY_ID:
        if (guideInputRef.current) guideInputRef.current.focus();
        break;
      case MEMBER.BIRTH:
        if (birthInputRef.current) birthInputRef.current.focus();
        break;
      case MEMBER.SCHOOL:
        if (schoolInputRef.current) schoolInputRef.current.focus();
        break;
      case MEMBER.OCCUPATION:
        if (occupationInputRef.current) occupationInputRef.current.focus();
        break;
      case MEMBER.MARRIAGE:
        if (marriageInputRef.current) marriageInputRef.current.focus();
        break;
      case MEMBER.DETAIL_MARRIAGE:
        if (detailMarriageInputRef.current)
          detailMarriageInputRef.current.focus();
        break;
      case MEMBER.ADDRESS:
        if (addressInputRef.current) addressInputRef.current.focus();
        break;
      case MEMBER.DETAIL_ADDRESS:
        if (detailAddressInputRef.current)
          detailAddressInputRef.current.focus();
        break;
      case MEMBER.HOME_PHONE:
        if (homePhoneInputRef.current) homePhoneInputRef.current.focus();
        break;
      default:
        break;
    }
  }, [focusItem]);
  return (
    <RequiredRegisterContainer>
      <ImageContainer>
        {/* 프로필 이미지*/}
        <MemberImageInput
          value={member.profileImage}
          onChange={onChangeProfileImage}
        />
      </ImageContainer>
      {/* 이름 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={nameInputRef}
        label={t("name")}
        value={member.name}
        onChange={onChangeName}
        placeholder={t_placeholder("name")}
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
          value={member.birth}
          onChange={onChangeBirth}
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
      {/* 학교  */}
      <LabelDropdown
        enterKeyHint={"done"}
        ref={schoolInputRef}
        label={t("school")}
        items={schoolItems}
        value={member.school}
        onChangeItem={(value) => onChangeSchool(value)}
        placeholder={t_placeholder("school")}
        isEditable={true}
        borderColor={getTrimmedString(member.school) ? BLACK : undefined}
      />
      {/* 직업 */}
      <LabelInput
        enterKeyHint={"done"}
        ref={occupationInputRef}
        label={t("occupation")}
        value={member.occupation}
        onChange={onChangeOccupation}
        placeholder={t_placeholder("occupation")}
        zIndex={1}
        borderColor={getTrimmedString(member.occupation) ? BLACK : undefined}
      />
      {/* 결혼 */}
      <LabelDropdown
        ref={marriageInputRef}
        label={t("marriage")}
        value={member.marriage}
        items={useMarriageDropdownItems()}
        onChangeItem={onChangeMarriage}
        placeholder={t_placeholder("marriage")}
        borderColor={member.marriage !== NULL ? BLACK : undefined}
      />
      {/* 결혼 상세 정보 */}
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
        borderColor={getTrimmedString(member.detailAddress) ? BLACK : undefined}
      />
      {/* 전화 번호 */}
      <LabelInput
        ref={homePhoneInputRef}
        inputMode={"numeric"}
        label={t("homePhone")}
        value={member.homePhone}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChangeHomePhone(event)
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
      {/* 차량 번호 */}
      <VehicleNumberInput
        enterKeyHint={"done"}
        ref={vehicleInputRef}
        label={t("vehicleNumber")}
        value={member.vehicleNumber}
        onChangeInput={onChangeVehicleNumber}
        placeholder={t_placeholder("vehicleNumber")}
      />
      <Invisible />
    </RequiredRegisterContainer>
  );
};

export default EditListView;
