import styled from 'styled-components';

import { MainText } from '@mokjang/components';
import { MAIN, SIZE, WHITE } from '@mokjang/constants';
import UserRegisterList from '../../molecules/auth/user-register-list';

const UserRegisterContainer = styled.div`
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

const UserRegister = () => {
  return (
    <UserRegisterContainer>
      <LogoContainer>
        {/*<Logo />*/}
        <MainText color={WHITE} size={SIZE.LARGE}>
          {'MOKJANG'}
        </MainText>
      </LogoContainer>
      <UserRegisterList />
    </UserRegisterContainer>
  );
};

export default UserRegister;
