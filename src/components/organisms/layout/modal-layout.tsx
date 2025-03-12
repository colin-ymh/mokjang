'use client';

import React from 'react';

import Wrap from '@/components/atoms/layout/wrap';
import ModalContent from '@/components/atoms/layout/content/modal-content';
import ModalContainer from '@/components/atoms/layout/container/modal-container';

export type ModalLayoutProps = {
  children: React.ReactNode;
};

const ModalLayout = ({ children }: ModalLayoutProps) => {
  return (
    <Wrap>
      <ModalContainer>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </Wrap>
  );
};

export default ModalLayout;
