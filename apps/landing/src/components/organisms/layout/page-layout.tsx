import Wrap from '@/components/atoms/layout/wrap/wrap';
import Header from '@/components/atoms/layout/header/header';
import Container from '@/components/atoms/layout/container/container';
import Footer from '@/components/atoms/layout/footer/footer';

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <Wrap>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </Wrap>
    </>
  );
};

export default PageLayout;
