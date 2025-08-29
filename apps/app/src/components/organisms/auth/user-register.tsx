import styled from 'styled-components';

import { MainText } from '../../atoms/common/text/main-text';
import { SIZE } from '../../../constants/styles/style';
import { MAIN, WHITE } from '../../../constants/styles/color';
import UserRegisterList from '../../molecules/auth/user-register-list';

import Sheep from '../../../../public/svg/sheep.svg';

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

const Logo = styled(Sheep)`
  width: 80px;
  height: 80px;

  path {
    fill: ${WHITE};
  }

  circle {
    fill: ${WHITE};
  }
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
