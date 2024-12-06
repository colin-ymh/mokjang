import styled from "styled-components";
import { GRAY } from "@/constants/styles/color";
import { MainText } from "@/components/atoms/common/text/main-text";
import MainInput from "@/components/atoms/common/input/main-input";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  display: flex;
  background-color: ${GRAY.BACKGROUND};
  padding: 15px 50px;
  border-top: 1px solid ${GRAY.LIGHT};
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const InformationContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100px;
  padding: 10px 30px;
  gap: 10px;
`;

const ContentIcon = styled.div`
  width: 15px;
  height: 15px;
  background-color: black;
`;

const InputContainer = styled.div`
  display: flex;
  margin: 5px;
  width: 100%;
`;

const MemberInformationList = () => {
  return (
    <InformationListContainer>
      <ListHeader>
        <MainText>교인 정보</MainText>
      </ListHeader>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>직분</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>소그룹</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>사역</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>교육 이수</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <ListHeader>
        <MainText>개인 정보</MainText>
      </ListHeader>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>성별</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>전화번호</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>집 번호</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>주소</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default MemberInformationList;
