import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import {
  useEducationDropdownItems,
  useGroupDropdownItems,
  useMinistryDropdownItems,
  useOfficerDropdownItems,
} from "@/hooks/dropdown/dropdown-items";
import { MEMBER } from "@/constants/member/member-column";
import { NULL } from "@/constants/constant";
import { GRAY } from "@/constants/styles/color";

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
  width: 200px;
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
  width: 100%;
`;

type MemberInformationListViewProps = {
  onChangeGroup: (value: string) => void;
  onChangeOfficer: (value: string) => void;
  onChangeMinistry: (value: string) => void;
  onChangeEducation: (value: string) => void;
};

const MemberInformationListView = ({
  onChangeGroup,
  onChangeOfficer,
  onChangeMinistry,
  onChangeEducation,
}: MemberInformationListViewProps) => {
  const t = useI18n();
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { groups, officers, ministries, educations } = useSelector(
    (state: RootState) => state.church,
  );
  return (
    <InformationListContainer>
      {/* 소그룹 */}
      <InformationContent>
        <ContentTitleContainer>
          <ContentIcon />
          <MainText>{t(MEMBER.GROUP)}</MainText>
        </ContentTitleContainer>
        <InputContainer>
          <Dropdown
            value={member.groupId || NULL}
            items={useGroupDropdownItems()}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeGroup}
          />
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
            items={useOfficerDropdownItems()}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeOfficer}
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
            items={useMinistryDropdownItems()}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeMinistry}
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
            items={useEducationDropdownItems()}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeEducation}
          />
        </InputContainer>
      </InformationContent>
    </InformationListContainer>
  );
};

export default MemberInformationListView;
