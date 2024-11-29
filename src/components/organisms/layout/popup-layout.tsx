"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import Container from "@/components/atoms/layout/container";
import Main from "@/components/atoms/layout/main";
import PopupHeader from "@/components/molecules/layout/popup-header";

export type PopupLayoutProps = {
  onClickLeft: () => void;
  children: React.ReactNode;
};

const PopupLayout = ({
  onClickLeft,
  children,
}: PopupLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Container>
        <PopupHeader onClickLeft={onClickLeft} />
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default PopupLayout;
