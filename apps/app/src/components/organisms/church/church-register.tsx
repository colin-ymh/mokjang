import styled from 'styled-components';

import ChurchRegisterList from '../../molecules/church/church-register-list';
import { useScopedI18n } from '../../../../locales/client';
import { MainText } from '../../../../../../packages/components/src';
import { GRAY } from '../../../../../../packages/constants/src';

const ChurchRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 50px 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ChurchRegister = () => {
  const t_register = useScopedI18n('register');

  return (
    <ChurchRegisterContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_register('churchRegisterTitle')}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {t_register('churchRegisterDescription')}
        </MainText>
      </HeaderContainer>
      <ChurchRegisterList />
    </ChurchRegisterContainer>
  );
};

export default ChurchRegister;
