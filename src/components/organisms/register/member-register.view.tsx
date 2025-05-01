import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MEMBER_REGISTER_STAGE } from '@/constants/constant';
import PersonalRegister from '@/components/molecules/register/personal-register';
import ReligiousRegister from '@/components/molecules/register/religious-register';
import RequiredRegister from '@/components/molecules/register/required-register';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  flex: 1;
`;

type MemberRegisterViewProps = {
  setIsShown?: Dispatch<SetStateAction<boolean>>;
};

const MemberRegisterView = ({ setIsShown }: MemberRegisterViewProps) => {
  const { stage } = useSelector((state: RootState) => state.memberRegister);

  return (
    <RegisterContainer>
      {stage === MEMBER_REGISTER_STAGE.REQUIRED && <RequiredRegister />}
      {stage === MEMBER_REGISTER_STAGE.PERSONAL && <PersonalRegister />}
      {stage === MEMBER_REGISTER_STAGE.RELIGIOUS && <ReligiousRegister />}
    </RegisterContainer>
  );
};

export default MemberRegisterView;
