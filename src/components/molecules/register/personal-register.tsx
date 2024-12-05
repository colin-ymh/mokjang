"use client";

import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import { gsap } from "gsap";

import { getSchool } from "@/api/school-api";
import { TemporalMember } from "@/models/register/member-register";
import { getDateFromString, getIsChild } from "@/utils/date";
import { setMember } from "@/redux/reducers/member-register-reducer";
import PersonalRegisterView from "@/components/molecules/register/personal-register.view";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import PagePopup from "@/components/atoms/common/popup/page-popup";
import { CALENDAR_MODE } from "@/constants/constant";
import { getIsWellFormedBirth, getIsWellFormedHomePhone } from "@/utils/check";
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedVehicleNumber,
  getTrimmedString,
} from "@/utils/format";

const PersonalRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { member } = useSelector((state: RootState) => state.memberRegister);

  const [schoolItems, setSchoolItems] = useState<DropdownValueType[]>([]);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  // 학교 input 창 애니메이션 효과
  const schoolAnimationRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (schoolAnimationRef.current) {
      const isChild = getIsChild(getDateFromString(member.birth));
      if (isChild && getIsWellFormedBirth(member.birth)) {
        // 미성년자일 경우 애니메이션으로 나타남
        gsap.to(schoolAnimationRef.current, {
          opacity: 1,
          height: 70,
          marginBottom: 0,
          duration: 0.3,
          ease: "power1.inOut",
          display: "block",
          zIndex: 5,
        });
      } else {
        // 성인일 경우 애니메이션으로 사라짐
        gsap.to(schoolAnimationRef.current, {
          opacity: 0,
          height: 0,
          marginBottom: -20,
          duration: 0.3,
          ease: "power1.inOut",
          zIndex: 0,
          // display: "none",
        });
      }
    }
  }, [schoolAnimationRef, member.birth]);

  // 이미지 변경 이벤트
  const onChangeProfileImage = (profileImage: string) => {
    dispatch(setMember({ ...member, profileImage }));
  };

  // 성별 변경 시 이벤트
  const onChangeGender = (gender: string) => {
    dispatch(setMember({ ...member, gender }));
  };

  // 생년월일 변경 시 이벤트
  const onChangeBirth = (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    const newBirth = getFormattedDate(event.target.value);
    dispatch(setMember({ ...member, birth: newBirth }));

    // 생년월일을 다 입력한 경우
    if (getIsWellFormedBirth(newBirth)) {
      // 다음 입력이 있다면 다음 입력으로
      if (nextInputRef?.current) {
        nextInputRef.current.focus();
      }
      // 없으면 키보드 내리기
      else {
        (event.target as HTMLInputElement).blur();
      }
    }
  };

  // 양력 음력 변경 이벤트
  const onChangeCalendarMode = (mode: CALENDAR_MODE) => {
    dispatch(setMember({ ...member, isLunar: mode === CALENDAR_MODE.LUNAR }));
  };

  // 학교 변경 시 이벤트
  const onChangeSchool = (
    value: string,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    const newSchool = getTrimmedString(value);
    dispatch(setMember({ ...member, school: newSchool }));

    // value 에 따라 학교 검색 API 요청
    getSchool(value, 1, 5).then((response) => {
      const items: DropdownValueType[] = response.map((value) => {
        return { value: value.SCHUL_NM, title: value.SCHUL_NM };
      });

      setSchoolItems(items);
    });
  };

  // 직업 변경 시 이벤트
  const onChangeOccupation = (event: ChangeEvent<HTMLInputElement>) => {
    const newOccupation = event.target.value;
    dispatch(setMember({ ...member, occupation: newOccupation }));
  };

  // 결혼 정보 변경 시 이벤트
  const onChangeMarriage = (value: string) => {
    dispatch(setMember({ ...member, marriage: value }));
  };

  // 결혼 정보 드롭다운 아이템 선택 시 이벤트
  const onClickMarriageDropdownItem = (
    nextInputRef: RefObject<HTMLInputElement>,
  ) => {
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
  };

  // 결혼 상세 변경 시 이벤트
  const onChangeDetailMarriage = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMember({ ...member, detailMarriage: event.target.value }));
  };

  // 도로명주소 입력창 이벤트
  const onClickAddress = () => {
    setIsAddressOpen(true);
  };

  // 도로명주소 검색 api 내 주소 선택 이벤트
  const onCompleteAddress = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    const newMember: TemporalMember = member;
    dispatch(setMember({ ...newMember, address: fullAddress }));
    setIsAddressOpen(false);
  };

  // 상세 주소 변경 시 이벤트
  const onChangeDetailAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const newDetailAddress = event.target.value;
    dispatch(setMember({ ...member, detailAddress: newDetailAddress }));
  };

  // 전화번호 변경 시 이벤트
  const onChangeHomePhone = (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    const newHomePhone = getFormattedHomePhone(event.target.value);
    dispatch(setMember({ ...member, homePhone: newHomePhone }));

    if (getIsWellFormedHomePhone(newHomePhone)) {
      // 다음 입력이 있다면 다음 입력으로
      if (nextInputRef?.current) {
        nextInputRef.current.focus();
      }
      // 없으면 키보드 내리기
      else {
        (event.target as HTMLInputElement).blur();
      }
    }
  };

  // 차량 번호 변경 시 이벤트
  const onChangeVehicleNumber = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    // vehicleNumber 배열을 복사하여 새로운 배열 생성
    const newVehicleNumber = [...member.vehicleNumber];

    // 수정할 인덱스의 값을 변경
    newVehicleNumber[index] = getFormattedVehicleNumber(event.target.value);

    // 새로운 member 객체와 vehicleNumber 배열을 디스패치
    dispatch(setMember({ ...member, vehicleNumber: newVehicleNumber }));
  };

  const props = {
    schoolAnimationRef,
    schoolItems,
    isAddressOpen,
    onChangeProfileImage,
    onChangeBirth,
    onChangeCalendarMode,
    onChangeHomePhone,
    onChangeOccupation,
    onChangeDetailAddress,
    onChangeSchool,
    onChangeVehicleNumber,
    onChangeMarriage,
    onClickMarriageDropdownItem,
    onChangeDetailMarriage,
    onChangeGender,
    onClickAddress,
    onCompleteAddress,
  };

  return (
    <>
      <PersonalRegisterView {...props} />
      <PagePopup isShow={isAddressOpen} setIsShow={setIsAddressOpen}>
        <DaumPostcodeEmbed
          onComplete={onCompleteAddress}
          style={{ width: "100%", height: "100%" }}
        />
      </PagePopup>
    </>
  );
};

export default PersonalRegister;
