'use client';

import { ReactNode } from 'react';

import Wrap from '@/components/atoms/layout/wrap';
import Container from '@/components/atoms/layout/container/container';
import Main from '@/components/atoms/layout/main/main';

import SideBar from '@/components/molecules/layout/side-bar';
import Header from '@/components/atoms/layout/header';

export type MainLayoutProps = {
  header: ReactNode;
  content: ReactNode;
};

const MainLayout = ({ header, content }: MainLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <SideBar />
      <Container>
        <Header>{header}</Header>
        <Main>{content}</Main>
      </Container>
    </Wrap>
  );
};

export default MainLayout;
