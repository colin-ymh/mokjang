import styled from "styled-components";
import MemberTable from "@/components/molecules/member/member-table";
import PagePopup from "@/components/atoms/common/popup/page-popup";
import MemberInformation from "@/components/organisms/member/member-information";
import { useState } from "react";
import { BLANK } from "@/constants/constant";
import { Member } from "@/models/member/member";
import { DEFAULT_MEMBER } from "@/redux/reducers/member-register-reducer";

const MemberListContainer = styled.div`
  display: flex;
  padding: 30px;
`;

const MemberList = () => {
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);
  const [currentMember, setCurrentMember] = useState<Member>(DEFAULT_MEMBER);

  const onClickMemberItem = (member: Member) => {
    setCurrentMember(member);
    setIsMemberInformationShown(true);
  };

  return (
    <MemberListContainer>
      <MemberTable onClickMemberItem={onClickMemberItem} />
      <PagePopup
        isShow={isMemberInformationShown}
        setIsShow={setIsMemberInformationShown}
      >
        <MemberInformation member={currentMember} />
      </PagePopup>
    </MemberListContainer>
  );
};

export default MemberList;
