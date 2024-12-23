import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY } from "@/constants/styles/color";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
  padding: 30px 20px 0 20px;
  gap: 30px;
  flex-shrink: 0; /* 크기가 줄어들지 않도록 설정 */
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 10px;
`;

const ProfileImage = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${GRAY.DEFAULT};
`;

const SideBarHeader = () => {
  return (
    <HeaderContainer>
      <MainText fontSize={23} fontWeight={600}>
        워크리움 교회
      </MainText>
      <ProfileContainer>
        <ProfileImage />
        <MainText fontSize={18}>나천호 목사</MainText>
      </ProfileContainer>
    </HeaderContainer>
  );
};
export default SideBarHeader;
