import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../../../redux/store';
import { GRAY } from '@mokjang/constants';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 70px;
  padding: 20px 10px 0 10px;
  gap: 10px;
  flex-shrink: 0;
`;

const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${GRAY.SEMI_LIGHT};
  border-radius: 5px;
`;

const SideHeader = () => {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <HeaderContainer>
      {/*<ProfileImage />*/}
      {/*<MainText size={SIZE.EXTRA_LARGE}>{church-church-church-user.name}</MainText>*/}
    </HeaderContainer>
  );
};
export default SideHeader;
