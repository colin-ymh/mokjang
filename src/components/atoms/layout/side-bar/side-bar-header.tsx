import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';

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
  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>워크리움 교회</MainText>
      <MainText size={SIZE.LARGE} fontWeight={600} color={GRAY.DARK}>
        나천호 목사
      </MainText>
    </HeaderContainer>
  );
};
export default SideBarHeader;
