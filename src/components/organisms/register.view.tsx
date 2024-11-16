"use client";

import { ChangeEvent } from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { TEXT } from "@/constant/locales/text";
import LabelInput from "@/components/atoms/label-input";

import {
  getFormattedHomePhone,
  getFormattedPersonalPhone,
} from "@/utils/format";
import { SCOPED } from "@/constant/locales/scoped/placeholder";
import { MemberRegisterType } from "@/models/register/member-register";

import { useI18n, useScopedI18n } from "../../../locales/client";

const RegisterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

type RegisterViewProps = {
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangePersonalPhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeHomePhone: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeJob: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RegisterView = ({
  onChangeName,
  onChangePersonalPhone,
  onChangeHomePhone,
  onChangeJob,
}: RegisterViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n(SCOPED.PLACEHOLDER);

  const member: MemberRegisterType = useSelector(
    (state: RootState): MemberRegisterType => state.memberRegister.member,
  );

  return (
    <RegisterContainer>
      {/* 이름 */}
      <LabelInput
        label={t(TEXT.NAME)}
        value={member.name}
        onChange={onChangeName}
        placeholder={t_placeholder(TEXT.NAME)}
      />
      {/* 휴대폰 번호 */}
      <LabelInput
        label={t(TEXT.PERSONAL_PHONE)}
        value={getFormattedPersonalPhone(member.personalPhone)}
        onChange={onChangePersonalPhone}
        placeholder={t_placeholder(TEXT.PERSONAL_PHONE)}
      />
      {/* 전화 번호 */}
      <LabelInput
        label={t(TEXT.HOME_PHONE)}
        value={getFormattedHomePhone(member.homePhone)}
        onChange={onChangeHomePhone}
        placeholder={t_placeholder(TEXT.HOME_PHONE)}
      />
      {/* 직업 */}
      <LabelInput
        label={t(TEXT.JOB)}
        value={member.job}
        onChange={onChangeJob}
        placeholder={t_placeholder(TEXT.JOB)}
      />
    </RegisterContainer>
  );
};

export default RegisterView;
