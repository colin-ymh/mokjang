import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import MainInput from "@/components/atoms/common/input/main-input";
import { Member } from "@/models/member/member";

import { useI18n } from "../../../../locales/client";

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

type PersonalInformationListProps = {
  member: Member;
};

const PersonalInformationList = ({ member }: PersonalInformationListProps) => {
  const t = useI18n();
  return (
    <InformationListContainer>
      {/* 성별 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("gender")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.gender} />
        </InputContainer>
      </InformationContent>
      {/* 생년월일 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("birth")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.birth} />
        </InputContainer>
      </InformationContent>
      {/* 휴대전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("mobilePhone")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.mobilePhone} />
        </InputContainer>
      </InformationContent>
      {/* 집전화번호 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("homePhone")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.homePhone} />
        </InputContainer>
      </InformationContent>
      {/* 도로명 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("address")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.address} />
        </InputContainer>
      </InformationContent>
      {/* 상세 주소 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("detailAddress")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.detailAddress} />
        </InputContainer>
      </InformationContent>
      {/* 직업 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("occupation")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.occupation} />
        </InputContainer>
      </InformationContent>
      {/* 학교 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("school")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.school} />
        </InputContainer>
      </InformationContent>
      {/* 결혼 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("marriage")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.marriage} />
        </InputContainer>
      </InformationContent>
      {/* 결혼 상세정보 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t("detailMarriage")}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.detailMarriage} />
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default PersonalInformationList;
