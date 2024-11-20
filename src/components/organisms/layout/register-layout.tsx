"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import Container from "@/components/atoms/layout/container";
import Main from "@/components/atoms/layout/main";
import RegisterHeader from "@/components/molecules/layout/register-header";

export type RegisterLayoutProps = {
  children: React.ReactNode;
};

const RegisterLayout = ({ children }: RegisterLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <RegisterHeader />
      <Container>
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default RegisterLayout;
