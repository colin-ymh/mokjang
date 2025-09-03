'use client';

import { ReactNode, useState } from 'react';

import Wrap from '../../atoms/layout/wrap';
import Container from '../../atoms/layout/container/container';
import Content from '../../atoms/layout/content/content';
import Header from '../../atoms/layout/header';
import Main from '../../atoms/layout/main';
import Top from '../../molecules/layout/top/top';
import Side from '../../molecules/layout/side/side';

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
  const [isSideShown, setIsSideShown] = useState<boolean>(true);

  const handleSideShow = () => {
    setIsSideShown(!isSideShown);
  };

  return (
    <Wrap>
      <Top handleSideShow={handleSideShow} />
      <Container>
        <Side sideButtonList={side} isSideShown={isSideShown} />
        <Main>
          <Header>{header}</Header>
          <Content>{content}</Content>
        </Main>
      </Container>
    </Wrap>
  );
};

export default MainLayout;
