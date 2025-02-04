import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { RootState } from '@/redux/store';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100px;
  padding: 30px 10px 0 10px;
  gap: 10px;
  flex-shrink: 0;
`;

const SideBarHeader = () => {
  const { church } = useSelector((state: RootState) => state.church);

  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>{church.name}</MainText>
    </HeaderContainer>
  );
};
export default SideBarHeader;
