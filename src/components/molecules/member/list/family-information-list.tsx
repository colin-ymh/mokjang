import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setMember } from "@/redux/reducers/member-register-reducer";

import { FamilyApi } from "@/api/churches/family.api";
import { FAMILY } from "@/constants/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import { FamilyMember, Member } from "@/models/member/member";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import { useFamilyRelationDropdownItems } from "@/hooks/dropdown/dropdown-items";
import Button from "@/components/atoms/common/button/button";
import { GRAY } from "@/constants/styles/color";
import { MembersApi } from "@/api/churches/members.api";
import { getMemberFromServer } from "@/utils/member";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`;

const MemberTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 200px;
  padding: 10px;
  gap: 10px;
`;

const FamilyMemberItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
  padding-bottom: 10px;
`;

type FamilyInformationListProps = {
  targetMember: Member;
};

const FamilyInformationList = ({
  targetMember,
}: FamilyInformationListProps) => {
  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const dispatch = useDispatch<AppDispatch>();
  const familyApi = new FamilyApi(false);
  const membersApi = new MembersApi(false);

  const familyDropdownItems = useFamilyRelationDropdownItems();

  // 가족 관계 수정
  const onChangeRelation = (familyMemberId: string, relation: FAMILY) => {
    if (familyMemberId && relation) {
      familyApi.editFamily(
        { churchId, memberId: member.id, familyMemberId },
        { relation },
      );
    }
  };

  const onClickFamilyMember = (familyMemberId: string) => {
    if (familyMemberId) {
      membersApi
        .getMember({ churchId, memberId: familyMemberId })
        .then((response) => {
          if (response.status === 200) {
            const newMember = getMemberFromServer(response.data.data);
            dispatch(setMember(newMember));
          }
        });
    }
  };

  return (
    <ListContainer>
      {member.family.map((member: FamilyMember) => {
        return (
          <FamilyMemberItem key={member.familyMemberId}>
            <MemberTitleContainer>
              <MainText>{member.familyMember.name}</MainText>
              <Button
                text={"상세보기"}
                width={70}
                onClick={() => onClickFamilyMember(member.familyMemberId)}
              />
            </MemberTitleContainer>
            <Dropdown
              value={member.relation}
              items={familyDropdownItems}
              onChangeItem={(value) =>
                onChangeRelation(member.familyMemberId, value)
              }
            />
          </FamilyMemberItem>
        );
      })}
    </ListContainer>
  );
};

export default FamilyInformationList;
