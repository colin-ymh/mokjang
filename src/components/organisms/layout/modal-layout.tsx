"use client";

import React from "react";

import Wrap from "@/components/atoms/layout/wrap";
import ModalMain from "@/components/atoms/layout/main/modal-main";
import ModalContainer from "@/components/atoms/layout/container/modal-container";

export type ModalLayoutProps = {
  children: React.ReactNode;
};

const ModalLayout = ({ children }: ModalLayoutProps) => {
  return (
    <Wrap>
      <ModalContainer>
        <ModalMain>{children}</ModalMain>
      </ModalContainer>
    </Wrap>
  );
};

export default ModalLayout;
