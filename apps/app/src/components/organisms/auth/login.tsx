import styled from 'styled-components';
import { MAIN, SIZE, WHITE } from '@mokjang/constants';

import { MainText } from '@mokjang/components';
import LoginList from '../../molecules/auth/login-list';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 30px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${MAIN.DEFAULT};
  border-radius: 10px;
  padding: 10px;
  width: 100px;
  height: 100px;
`;

const Login = () => {
  return (
    <LoginContainer>
      <LogoContainer>
        {/*<Logo />*/}
        <MainText color={WHITE} size={SIZE.LARGE}>
          {'MOKJANG'}
        </MainText>
      </LogoContainer>
      <LoginList />
    </LoginContainer>
  );
};

export default Login;
