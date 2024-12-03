"use client";

import React from "react";
import Wrap from "@/components/atoms/layout/wrap";
import Main from "@/components/atoms/layout/main";
import RegisterHeader from "@/components/molecules/layout/header/register-header";
import Container from "@/components/atoms/layout/container";

export type RegisterLayoutProps = {
  children: React.ReactNode;
};

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  return (
    <Wrap>
      <Container>
        <RegisterHeader />
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default RegisterLayout;
