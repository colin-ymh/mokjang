import { ChangeEvent, RefObject } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import BorderInput from "@/components/atoms/common/input/border-input";
import {
  useCalendarModeRadioButtonItems,
  useGenderRadioButtonItems,
} from "@/hooks/radio-button/radio-button-items";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { BLANK, CALENDAR_MODE, MARRIAGE, NULL } from "@/constants/constant";
import { MEMBER } from "@/constants/member/member-column";
import { useMarriageDropdownItems } from "@/hooks/dropdown/dropdown-items";
import VehicleNumberInput from "@/components/atoms/register/vehicle-number-input";
import { GRAY } from "@/constants/styles/color";

import { useI18n } from "../../../../locales/client";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InformationContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 200px;
  padding: 10px;
  gap: 10px;
`;

const ContentIcon = styled.div`
  width: 15px;
  height: 15px;
  background-color: lightgray;
`;

const InputContainer = styled.div`
  display: flex;
  margin: 5px;
  width: 100%;
  gap: 10px;
`;

const Invisible = styled.div`
  height: 100px;
`;

type PersonalInformationListViewProps = {
  schoolItems: DropdownValueType[];
  calendarMode: CALENDAR_MODE;
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
  calendarMode,
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
        <InputContainer>
          <Dropdown
            value={member.gender}
            items={[
              ...useGenderRadioButtonItems(),
              { value: NULL, title: t(NULL) },
            ]}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeGender}
          />
        </InputContainer>
      </InformationContent>
      {/* 생년월일 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.BIRTH)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            width={100}
            value={calendarMode}
            items={useCalendarModeRadioButtonItems()}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeCalendarMode}
          />
          <BorderInput
            value={member.birth}
            onChange={onChangeBirth}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      {/* 휴대전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.MOBILE_PHONE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <BorderInput value={member.mobilePhone} borderColor={GRAY.LIGHT} />
        </InputContainer>
      </InformationContent>
      {/* 집전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.HOME_PHONE)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <BorderInput
            value={member.homePhone}
            onChange={onChangeHomePhone}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      {/* 도로명 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.ADDRESS)}</MainText>
        </ContentTitleContainer>
        <InputContainer onClick={onClickAddress}>
          <BorderInput value={member.address} borderColor={GRAY.LIGHT} />
        </InputContainer>
      </InformationContent>
      {/* 상세 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.DETAIL_ADDRESS)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <BorderInput
            value={member.detailAddress}
            onChange={onChangeDetailAddress}
            borderColor={GRAY.LIGHT}
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
          <BorderInput
            value={member.occupation}
            onChange={onChangeOccupation}
            borderColor={GRAY.LIGHT}
          />
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
            borderColor={GRAY.LIGHT}
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
            borderColor={GRAY.LIGHT}
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
          <BorderInput
            value={member.detailMarriage}
            onChange={onChangeDetailMarriage}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      {/* 차량 번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.VEHICLE_NUMBER)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <VehicleNumberInput
            value={member.vehicleNumber.concat(BLANK, BLANK, BLANK).slice(0, 3)}
            onChangeInput={onChangeVehicleNumber}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      <Invisible />
    </InformationListContainer>
  );
};

export default PersonalInformationListView;
