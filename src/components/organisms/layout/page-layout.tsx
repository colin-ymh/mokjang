"use client";

import React from "react";
import Wrap from "@/components/atoms/layout/wrap";
import Main from "@/components/atoms/layout/main";
import Container from "@/components/atoms/layout/container";
import Header from "@/components/atoms/layout/header";

export type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Wrap>
      <Container>
        <Header />
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default PageLayout;
