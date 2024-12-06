"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import Container from "@/components/atoms/layout/container";
import PopupHeader from "@/components/molecules/layout/header/popup-header";
import PopupMain from "@/components/atoms/layout/popup-main";

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
        <PopupMain>{children}</PopupMain>
      </Container>
    </Wrap>
  );
};

export default PopupLayout;
