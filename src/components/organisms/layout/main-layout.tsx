"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import Container from "@/components/atoms/layout/container";
import Main from "@/components/atoms/layout/main";

export type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Container>
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default MainLayout;
