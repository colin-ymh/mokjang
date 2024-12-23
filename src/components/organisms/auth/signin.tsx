import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import SignInAuthList from "@/components/molecules/auth/signin-list";
import { MEDIA_MIN_WIDTH } from "@/constants/constant";

const SignInContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    padding: 0;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    padding: 0 20%;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    padding: 0 30%;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30%;
`;

const SignIn = () => {
  return (
    <SignInContainer>
      <LogoContainer>
        <MainText fontSize={36} fontWeight={800}>
          목장 로고
        </MainText>
      </LogoContainer>
      <SignInAuthList />
    </SignInContainer>
  );
};

export default SignIn;
