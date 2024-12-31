"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import Container from "@/components/atoms/layout/container";
import AuthMain from "@/components/atoms/layout/auth-main";

export type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Wrap>
      <Container>
        <AuthMain>{children}</AuthMain>
      </Container>
    </Wrap>
  );
};

export default PageLayout;
