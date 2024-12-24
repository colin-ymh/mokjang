import styled from "styled-components";
import Image from "next/image";
import { Member } from "@/models/member/member";
import { GRAY } from "@/constants/styles/color";
import DefaultImage from "../../../../../public/png/default-member-image.png";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useI18n } from "../../../../../locales/client";
import { MemberTableProps } from "@/components/molecules/member/list/member-table";

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${GRAY.LIGHT};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  gap: 10px;
  border-bottom: 1px solid ${GRAY.LIGHT};
  height: 70px;
  cursor: pointer;
`;

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 5px;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MemberItemList = ({
  members,
  onClickMemberItem,
  onClickNextPage,
  onClickPrevPage,
}: MemberTableProps) => {
  const t = useI18n();

  return (
    <MemberListContainer>
      {members.map((member) => (
        <MemberItem
          key={member.id}
          onClick={() => onClickMemberItem(member.id)}
        >
          <ProfileImage
            src={member.profileImage || DefaultImage}
            alt={`profileImage`}
          />
          <MemberDetails>
            <MainText>{`${member.name} ${member.officerId || t("churchMember")}`}</MainText>
            <MainText>{member.mobilePhone}</MainText>
            <MainText>{member.groupId}</MainText>
          </MemberDetails>
        </MemberItem>
      ))}
    </MemberListContainer>
  );
};

export default MemberItemList;
