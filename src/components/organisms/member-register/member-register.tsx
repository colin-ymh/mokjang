"use client";

import React, { ChangeEvent, RefObject } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import { TemporalMember } from "@/models/register/member-register";
import MemberRegisterView from "@/components/organisms/member-register/member-register.view";
import { BAPTISM, MEMBER_REGISTER_TYPE } from "@/constant/constant";

const MemberRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

  // 새신자 타입 변경 시 이벤트
  const onChangeType = (type: MEMBER_REGISTER_TYPE) => {
    dispatch(setMember({ ...member, type }));
  };

  // 이름 변경 시 이벤트
  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newName = event.target.value;
    dispatch(setMember({ ...newMember, name: newName }));
  };

  // 휴대폰 번호 변경 시 이벤트
  const onChangeMobilePhone = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newMobilePhone = event.target.value;
    dispatch(setMember({ ...newMember, mobilePhone: newMobilePhone }));
    // 전화번호를 다 입력한 경우
    if (newMobilePhone.length > 12) {
      (event.target as HTMLInputElement).blur();
    }
  };

  // 인도자 변경 시 이벤트
  const onChangeGuide = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newGuide = event.target.value;
    dispatch(setMember({ ...newMember, guide: newGuide }));
  };

  // 가족 변경 시 이벤트
  const onChangeFamily = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newFamily = event.target.value;
    dispatch(setMember({ ...newMember, family: newFamily }));
  };

  // 생년월일 변경 시 이벤트
  const onChangeBirth = (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newBirth = event.target.value;
    dispatch(setMember({ ...newMember, birth: newBirth }));

    // 생년월일을 다 입력한 경우
    if (newBirth.length === 10) {
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

  // 전화번호 변경 시 이벤트
  const onChangeHomePhone = (
    event: ChangeEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newHomePhone = event.target.value;
    dispatch(setMember({ ...newMember, homePhone: newHomePhone }));

    // 전화번호를 다 입력한 경우
    if (newHomePhone.length === 12) {
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

  // 직업 변경 시 이벤트
  const onChangeOccupation = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newOccupation = event.target.value;
    dispatch(setMember({ ...newMember, occupation: newOccupation }));
  };

  // 도로명 주소 변경 시 이벤트
  const onChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newAddress = event.target.value;
    dispatch(setMember({ ...newMember, address: newAddress }));
  };

  // 상세 주소 변경 시 이벤트
  const onChangeDetailAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newDetailAddress = event.target.value;
    dispatch(setMember({ ...newMember, detailAddress: newDetailAddress }));
  };

  // 학교 변경 시 이벤트
  const onChangeSchool = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newSchool = event.target.value;
    dispatch(setMember({ ...newMember, school: newSchool }));
  };

  // 차량 번호 변경 시 이벤트
  const onChangeVehicleNumber = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    // member 객체를 복사하여 새로운 객체 생성
    const newMember: TemporalMember = { ...member };

    // vehicleNumber 배열을 복사하여 새로운 배열 생성
    const newVehicleNumber = [...member.vehicleNumber];

    // 수정할 인덱스의 값을 변경
    newVehicleNumber[index] = event.target.value;

    // 새로운 member 객체와 vehicleNumber 배열을 디스패치
    dispatch(setMember({ ...newMember, vehicleNumber: newVehicleNumber }));
  };

  // 결혼 정보 변경 시 이벤트
  const onChangeMarriage = (value: string) => {
    const newMember: TemporalMember = member;
    dispatch(setMember({ ...newMember, marriage: value }));
  };

  // 성별 변경 시 이벤트
  const onChangeGender = (gender: string) => {
    dispatch(setMember({ ...member, gender }));
  };

  // 직분 변경 시 이벤트
  const onChangeConfirmation = (value: string) => {
    const newMember: TemporalMember = member;
    dispatch(
      setMember({
        ...newMember,
        confirmation: value,
      }),
    );
  };

  // 임직일 날짜 변경 시 이벤트
  const onChangeConfirmationStartDate = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newConfirmationStartDate = event.target.value;
    dispatch(
      setMember({
        ...newMember,
        confirmationStartDate: newConfirmationStartDate,
      }),
    );
  };

  // 임직 교회 변경 시 이벤트
  const onChangeConfirmationStartChurch = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newMember: TemporalMember = member;
    const newConfirmationStartChurch = event.target.value;
    dispatch(
      setMember({
        ...newMember,
        confirmationStartChurch: newConfirmationStartChurch,
      }),
    );
  };

  // 신급
  const onChangeBaptism = (value: BAPTISM) => {
    dispatch(setMember({ ...member, baptism: value }));
  };

  // 이전 교회 변경 시 이벤트
  const onChangePreviousChurchName = (event: ChangeEvent<HTMLInputElement>) => {
    const newMember: TemporalMember = member;
    const newPreviousChurchName = event.target.value;
    dispatch(
      setMember({ ...newMember, previousChurchName: newPreviousChurchName }),
    );
  };

  // 엔터키 입력 후 포커스 이동 함수
  const onClickEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextInputRef?: RefObject<HTMLInputElement>,
  ) => {
    // IME keyCode 무시하기
    if (event.keyCode === 229) return;
    // 엔터키 입력 시
    if (event.key === "Enter") {
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

  const props = {
    common: {
      onClickEnter,
    },
    required: {
      onChangeType,
      onChangeName,
      onChangeMobilePhone,
      onChangeGuide,
      onChangeFamily,
    },
    personal: {
      onChangeBirth,
      onChangeHomePhone,
      onChangeOccupation,
      onChangeAddress,
      onChangeDetailAddress,
      onChangeSchool,
      onChangeVehicleNumber,
      onChangeMarriage,
      onChangeGender,
    },
    religious: {
      onChangeConfirmation,
      onChangeConfirmationStartDate,
      onChangeConfirmationStartChurch,
      onChangeBaptism,
      onChangePreviousChurchName,
    },
  };

  return (
    <>
      <MemberRegisterView {...props} />
    </>
  );
};

export default MemberRegister;
