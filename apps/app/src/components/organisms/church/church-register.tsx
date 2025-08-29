import styled from 'styled-components';

import ChurchRegisterList from '../../molecules/church/church-register-list';
import { useScopedI18n } from '../../../../locales/client';
import { MainText } from '../../atoms/common/text/main-text';
import { SIZE } from '../../../constants/styles/style';

const ChurchRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  padding: 20px;
  height: 100%;
`;

const ChurchRegister = () => {
  const t_register = useScopedI18n('register');

  return (
    <ChurchRegisterContainer>
      <MainText size={SIZE.EXTRA_LARGE}>
        {t_register('churchHeaderPhrase')}
      </MainText>
      <ChurchRegisterList />
    </ChurchRegisterContainer>
  );
};

export default ChurchRegister;
