'use client';

import React from 'react';

import Wrap from '@/components/atoms/layout/wrap';
import Container from '@/components/atoms/layout/container/container';
import PopupHeader from '@/components/atoms/layout/header/popup-header';
import PopupContent from '@/components/atoms/layout/content/popup-content';

export type PopupLayoutProps = {
  onClickClose: () => void;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

const PopupLayout = ({
  onClickClose,
  headerRight,
  children,
}: PopupLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Container>
        <PopupContent>{children}</PopupContent>
        <PopupHeader onClickClose={onClickClose} headerRight={headerRight} />
      </Container>
    </Wrap>
  );
};

export default PopupLayout;
