"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { gsap } from "gsap";

import { TemporalMember } from "@/models/register/member-register";
import { getDateFromString, getIsChild } from "@/utils/date";
import { CommonRegisterProps } from "@/components/molecules/member-register/required-register.view";
import PersonalRegisterView, {
  PersonalRegisterProps,
} from "@/components/molecules/member-register/personal-register.view";

const PersonalRegister = ({
  ...registerProps
}: PersonalRegisterProps & CommonRegisterProps) => {
  const member: TemporalMember = useSelector(
    (state: RootState): TemporalMember => state.memberRegister.member,
  );

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

  const props = {
    schoolAnimationRef,
    ...registerProps,
  };

  return (
    <>
      <PersonalRegisterView {...props} />
    </>
  );
};

export default PersonalRegister;
