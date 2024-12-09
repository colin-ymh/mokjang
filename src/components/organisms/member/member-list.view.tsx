import styled from "styled-components";

import MemberTable from "@/components/molecules/member/member-table";
import MemberFilter from "@/components/molecules/member/member-filter";
import { Member } from "@/models/member/member";

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

type MemberListViewProps = {
  members: Member[];
  onClickMemberItem: (member: Member) => void;
};

const MemberListView = ({
  members,
  onClickMemberItem,
}: MemberListViewProps) => {
  return (
    <MemberListContainer>
      <MemberFilter />
      <MemberTable members={members} onClickMemberItem={onClickMemberItem} />
    </MemberListContainer>
  );
};

export default MemberListView;
