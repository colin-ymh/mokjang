import React from "react";
import Wrap from "@/common/layout/wrap";
import Container from "@/common/layout/container";
import Main from "@/common/layout/main";

export type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <Container>
        <Main>{children}</Main>
      </Container>
    </Wrap>
  );
};

export default PageLayout;
