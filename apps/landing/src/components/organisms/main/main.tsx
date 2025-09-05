import styled from 'styled-components';
import Hero from '@/components/molecules/main/hero/hero';
import Function from '@/components/molecules/main/function/function';
import Price from '@/components/molecules/main/price/price';
import Faq from '@/components/molecules/main/faq/faq';

const MainWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const Main = () => {
  return (
    <MainWrapper>
      <Hero />
      <Function />
      {/*<Price />*/}
      <Faq />
    </MainWrapper>
  );
};

export default Main;
