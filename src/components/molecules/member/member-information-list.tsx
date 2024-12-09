import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import MainInput from "@/components/atoms/common/input/main-input";
import { Member } from "@/models/member/member";

import { useI18n } from "../../../../locales/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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
  width: 15%;
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

type MemberInformationListProps = {};

const MemberInformationList = ({}: MemberInformationListProps) => {
  const t = useI18n();
  const { member } = useSelector((state: RootState) => state.memberRegister);
  return (
    <InformationListContainer>
      {/* 직분 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("officer")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.officer} />
        </InputContainer>
      </InformationContent>
      {/* 소그룹 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>소그룹</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.group} />
        </InputContainer>
      </InformationContent>
      {/* 사역 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>사역</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.ministry} />
        </InputContainer>
      </InformationContent>
      {/* 교육 이수 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>교육 이수</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput />
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default MemberInformationList;
