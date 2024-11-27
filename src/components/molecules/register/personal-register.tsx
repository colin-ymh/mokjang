"use client";

import React, { ChangeEvent, RefObject, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { gsap } from "gsap";

import { TemporalMember } from "@/models/register/member-register";
import { getDateFromString, getIsChild } from "@/utils/date";
import PersonalRegisterView from "@/components/molecules/register/personal-register.view";
import { setMember } from "@/redux/reducers/member-register-reducer";
import { MEMBER_REGISTER_STAGE } from "@/constant/constant";

const PersonalRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { member } = useSelector((state: RootState) => state.memberRegister);

  // 학교 input 창 애니메이션 효과
  const schoolAnimationRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (schoolAnimationRef.current) {
      const isChild = getIsChild(getDateFromString(member.birth));
      if (isChild) {
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

    let MAX_LENGTH = 12;

    // 전화번호를 다 입력한 경우
    if (newHomePhone.slice(0, 2) === "02") {
      MAX_LENGTH = 11;
    } else {
      MAX_LENGTH = 12;
    }

    if (newHomePhone.length === MAX_LENGTH) {
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

  // 이미지 변경 이벤트
  const onChangeProfileImage = (profileImage: string) => {
    const newMember: TemporalMember = member;
    dispatch(setMember({ ...newMember, profileImage }));
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

  const props = {
    schoolAnimationRef,
    onChangeProfileImage,
    onChangeBirth,
    onChangeHomePhone,
    onChangeOccupation,
    onChangeAddress,
    onChangeDetailAddress,
    onChangeSchool,
    onChangeVehicleNumber,
    onChangeMarriage,
    onChangeGender,
  };

  return (
    <>
      <PersonalRegisterView {...props} />
    </>
  );
};

export default PersonalRegister;
