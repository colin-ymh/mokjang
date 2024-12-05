"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setMember, setStage } from "@/redux/reducers/member-register-reducer";

import ExtraMemberRegisterView from "@/components/organisms/register/extra-register-view";
import { MEMBER_REGISTER_STAGE } from "@/constants/constant";
import { TemporalMember } from "@/models/register/member-register";

const ExtraMemberRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    // const TEST_MEMBER: TemporalMember = {
    //   address: "경기도 부천시 길주로 573번길 37",
    //   baptism: "catechumenate",
    //   birth: "2000-11-20",
    //   confirmation: "deacon",
    //   confirmationStartChurch: "대박교회",
    //   confirmationStartDate: "2018-03-12",
    //   detailAddress: "306동 703호",
    //   family: "",
    //   gender: "male",
    //   guide: "",
    //   homePhone: "032-682-0654",
    //   marriage: "single",
    //   mobilePhone: "010-5696-6896",
    //   name: "유민혁",
    //   occupation: "대학생",
    //   previousChurchName: "성만교회",
    //   profileImage: "",
    //   school: "",
    //   type: "transferred",
    //   vehicleNumber: ["7697", "", ""],
    // };
    //
    // dispatch(setMember(TEST_MEMBER));
  }, []);

  const props = {};

  return (
    <>
      <ExtraMemberRegisterView {...props} />
    </>
  );
};

export default ExtraMemberRegister;
