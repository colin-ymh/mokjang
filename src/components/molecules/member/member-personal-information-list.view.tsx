import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import MainInput from "@/components/atoms/common/input/main-input";
import { Member } from "@/models/member/member";

import { useI18n } from "../../../../locales/client";
import { GRAY } from "@/constants/styles/color";
import RadioButton from "@/components/atoms/common/input/radio-button/radio-button";
import { useGenderRadioButtonItems } from "@/hooks/radio-button/radio-button-items";
import RegisterRadioButton from "@/components/atoms/register/register-radio-button";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { ChangeEvent, RefObject } from "react";
import { CALENDAR_MODE, MARRIAGE } from "@/constants/constant";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MEMBER } from "@/constants/member/member-column";
import { useMarriageDropdownItems } from "@/hooks/dropdown/dropdown-items";
import VehicleNumberInput from "@/components/atoms/register/vehicle-number-input";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const InformationContent = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const ContentTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 15%;
  padding: 10px;
  gap: 10px;
`;

const ContentIcon = styled.div`
  width: 15px;
  height: 15px;
  background-color: black;
`;

const InputContainer = styled.div`
  display: flex;
  margin: 5px;
  width: 100%;
`;

type PersonalInformationListViewProps = {
  schoolItems: DropdownValueType[];
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

const PersonalInformationListView = ({
  schoolItems,
  onChangeGender,
  onChangeBirth,
  onChangeCalendarMode,
  onChangeSchool,
  onChangeOccupation,
  onChangeMarriage,
  onChangeDetailMarriage,
  onClickAddress,
  onChangeDetailAddress,
  onChangeHomePhone,
  onChangeVehicleNumber,
}: PersonalInformationListViewProps) => {
  const t = useI18n();
  const { member } = useSelector((state: RootState) => state.memberRegister);

  return (
    <InformationListContainer>
      {/* 성별 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.GENDER)}</MainText>
        </ContentTitleContainer>
        <Dropdown
          value={member.gender}
          items={useGenderRadioButtonItems()}
          borderColor={"#00000000"}
          onChangeItem={onChangeGender}
        />
      </InformationContent>
      {/* 생년월일 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.BIRTH)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.birth} onChange={onChangeBirth} />
        </InputContainer>
      </InformationContent>
      {/* 휴대전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.MOBILE_PHONE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.mobilePhone} />
        </InputContainer>
      </InformationContent>
      {/* 집전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.HOME_PHONE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.homePhone} onChange={onChangeHomePhone} />
        </InputContainer>
      </InformationContent>
      {/* 도로명 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.ADDRESS)}</MainText>
        </ContentTitleContainer>
        <InputContainer onClick={onClickAddress}>
          <MainInput value={member.address} />
        </InputContainer>
      </InformationContent>
      {/* 상세 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.DETAIL_ADDRESS)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput
            value={member.detailAddress}
            onChange={onChangeDetailAddress}
          />
        </InputContainer>
      </InformationContent>
      {/* 직업 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.OCCUPATION)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.occupation} onChange={onChangeOccupation} />
        </InputContainer>
      </InformationContent>
      {/* 학교 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.SCHOOL)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.school}
            items={schoolItems}
            onChangeItem={onChangeSchool}
            isEditable={true}
            borderColor={"#00000000"}
          />
        </InputContainer>
      </InformationContent>
      {/* 결혼 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.MARRIAGE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.marriage}
            items={useMarriageDropdownItems()}
            onChangeItem={onChangeMarriage}
            borderColor={"#00000000"}
          />
        </InputContainer>
      </InformationContent>
      {/* 결혼 상세 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.DETAIL_MARRIAGE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput
            value={member.detailMarriage}
            onChange={onChangeDetailMarriage}
          />
        </InputContainer>
      </InformationContent>
      {/* 결혼 상세정보 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.VEHICLE_NUMBER)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          {/*<VehicleNumberInput*/}
          {/*  value={member.detailMarriage}*/}
          {/*  onChange={onChangeVehicleNumber}*/}
          {/*/>*/}
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default PersonalInformationListView;
