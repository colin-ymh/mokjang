'use client';

import { ReactNode } from 'react';

import Wrap from '@/components/atoms/layout/wrap';
import Container from '@/components/atoms/layout/container/container';
import Content from '@/components/atoms/layout/content/content';
import SideBar from '@/components/molecules/layout/side-bar';
import Header from '@/components/atoms/layout/header';
import Top from '@/components/atoms/layout/top';
import Main from '@/components/atoms/layout/main';

export type MainLayoutProps = {
  header: ReactNode;
  content: ReactNode;
};

const MainLayout = ({ header, content }: MainLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Top />
      <Container>
        <SideBar />
        <Main>
          <Header>{header}</Header>
          <Content>{content}</Content>
        </Main>
      </Container>
    </Wrap>
  );
};

export default MainLayout;
