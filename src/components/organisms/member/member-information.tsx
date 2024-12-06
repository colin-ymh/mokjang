import styled from "styled-components";
import { Member } from "@/models/member/member";
import { MainText } from "@/components/atoms/common/text/main-text";
import HeaderBarView from "@/components/molecules/layout/header/header-bar.view";
import MemberInformationHeader from "@/components/molecules/member/member-information-header";
import { useState } from "react";
import { getMemberInformationContent } from "@/hooks/layout/render-layout";

const InformationContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

type MemberInformationProps = {
  member: Member;
};

const MemberInformation = ({ member }: MemberInformationProps) => {
  const [contentId, setContentId] = useState<string>("");
  const onClickHeaderBarItem = (id: string) => {
    setContentId(id);
  };
  return (
    <InformationContainer>
      <MemberInformationHeader onClickItem={onClickHeaderBarItem} />
      {getMemberInformationContent(contentId)}
    </InformationContainer>
  );
};

export default MemberInformation;
