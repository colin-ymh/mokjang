'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setStage } from '@/redux/reducers/member-register-reducer';

import MemberRegisterView from '@/components/organisms/register/member-register.view';
import { MEMBER_REGISTER_STAGE } from '@/constants/constant';

type MemberRegisterProps = {
  setIsShown?: Dispatch<SetStateAction<boolean>>;
};

const MemberRegister = ({ setIsShown }: MemberRegisterProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
  }, []);

  const props = {
    setIsShown,
  };

  return (
    <>
      <MemberRegisterView {...props} />
    </>
  );
};

export default MemberRegister;
