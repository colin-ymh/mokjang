import styled from "styled-components";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BLACK, WHITE } from "@/constants/styles/color";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 3;
  padding: 10px;
  width: 80%;
`;

const OAuthItem = styled.div<{ $backgroundColor: string }>`
  display: flex;
  border-radius: 5px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

const NAVER_COLOR = "#2DB400";
const KAKAO_COLOR = "#FEE500";

const LoginList = () => {
  return (
    <ListContainer>
      <OAuthItem $backgroundColor={NAVER_COLOR}>
        <MainText fontSize={16} color={WHITE}>
          {"네이버"}
        </MainText>
      </OAuthItem>
      <OAuthItem $backgroundColor={WHITE}>
        <MainText fontSize={16} color={BLACK}>
          {"구글"}
        </MainText>
      </OAuthItem>
      <OAuthItem $backgroundColor={KAKAO_COLOR}>
        <MainText fontSize={16} color={BLACK}>
          {"카카오"}
        </MainText>
      </OAuthItem>
      <OAuthItem $backgroundColor={BLACK}>
        <MainText fontSize={16} color={WHITE}>
          {"애플"}
        </MainText>
      </OAuthItem>
    </ListContainer>
  );
};

export default LoginList;
