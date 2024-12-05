import styled from "styled-components";
import MemberTable from "@/components/molecules/member/member-table";

const MemberListContainer = styled.div`
  display: flex;
  padding: 30px;
`;

const MemberList = () => {
  return (
    <MemberListContainer>
      <MemberTable />
    </MemberListContainer>
  );
};

export default MemberList;
