import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import MainInput from "@/components/atoms/common/input/main-input";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import {
  useEducationDropdownItems,
  useMinistryDropdownItems,
  useOfficerDropdownItems,
} from "@/hooks/dropdown/dropdown-items";
import { MEMBER } from "@/constants/member/member-column";
import { NONE, NULL } from "@/constants/constant";

import { useI18n } from "../../../../locales/client";
import { GRAY } from "@/constants/styles/color";

const InformationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: lime;
  padding: 10px;
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
  padding: 10px;
  gap: 10px;
`;

const ContentIcon = styled.div`
  width: 15px;
  height: 15px;
  background-color: lightgray;
`;

const InputContainer = styled.div`
  display: flex;
  margin: 5px;
  width: 85%;
`;

type MemberInformationListProps = {};

const MemberInformationList = ({}: MemberInformationListProps) => {
  const t = useI18n();
  const { member } = useSelector((state: RootState) => state.memberRegister);
  return (
    <InformationListContainer>
      {/* 소그룹 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.GROUP)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <MainInput value={member.group} />
        </InputContainer>
      </InformationContent>
      {/* 직분 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.OFFICER)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.officer || NULL}
            items={[
              ...useOfficerDropdownItems(),
              { value: NULL, title: t(NULL) },
            ]}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      {/* 사역 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.MINISTRY)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.ministry || NULL}
            items={[
              ...useMinistryDropdownItems(),
              { value: NULL, title: t(NULL) },
            ]}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
      {/* 교육 이수 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.EDUCATION)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.education || NULL}
            items={[
              ...useEducationDropdownItems(),
              { value: NULL, title: t(NULL) },
            ]}
            borderColor={GRAY.LIGHT}
          />
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default MemberInformationList;
