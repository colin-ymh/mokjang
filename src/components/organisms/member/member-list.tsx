import { useState } from "react";
import styled from "styled-components";
import { DEFAULT_MEMBER } from "@/redux/reducers/member-register-reducer";

import MemberTable from "@/components/molecules/member/member-table";
import MemberInformation from "@/components/organisms/member/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import { Member } from "@/models/member/member";

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

  const onClickClose = () => {
    setIsMemberInformationShown(false);
  };

  return (
    <MemberListContainer>
      <MemberTable onClickMemberItem={onClickMemberItem} />
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
      >
        <MemberInformation member={currentMember} />
      </CustomPopup>
    </MemberListContainer>
  );
};

export default MemberList;
