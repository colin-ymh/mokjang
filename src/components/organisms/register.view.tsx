"use client";

import styled from "styled-components";
import LabelInput from "@/components/atoms/label-input";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const RegisterContainer = styled.div``;

const RegisterView = () => {
  const member = useSelector((state: RootState) => state.)
  return (
    <RegisterContainer>
      <LabelInput value={"이름"} label={""} />
    </RegisterContainer>
  );
};

export default RegisterView;
