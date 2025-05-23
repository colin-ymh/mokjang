'use client';

import { ReactNode } from 'react';

import Wrap from '@/components/atoms/layout/wrap';
import Container from '@/components/atoms/layout/container/container';
import Content from '@/components/atoms/layout/content/content';
import Header from '@/components/atoms/layout/header';
import Main from '@/components/atoms/layout/main';
import Top from '@/components/molecules/layout/top/top';
import Side from '@/components/molecules/layout/side/side';

export type MainLayoutProps = {
  side: ReactNode;
  header: ReactNode;
  content: ReactNode;
};

const MainLayout = ({
  side,
  header,
  content,
}: MainLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Top />
      <Container>
        <Side sideButtonList={side} />
        <Main>
          <Header>{header}</Header>
          <Content>{content}</Content>
        </Main>
      </Container>
    </Wrap>
  );
};

export default MainLayout;
