import React from "react";
import Image from "next/image";
import styled from "styled-components";

import { GRAY, WHITE } from "@/constants/styles/color";
import { MEMBER } from "@/constants/member/member-column";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BAPTISM, GENDER } from "@/constants/constant";
import Button from "@/components/atoms/common/button/button";
import { getAge, getDateFromString } from "@/utils/date";
import { getFormattedDate, getFormattedMobilePhone } from "@/utils/format";
import { Member } from "@/models/member/member";
import DefaultImage from "../../../../../public/png/default-member-image.png";
import { useI18n } from "../../../../../locales/client";
import MemberTableHeader from "@/components/atoms/member/list/member-table-header";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const TableContainer = styled.div`
  display: flex;
  width: 100%;
`;

const MemberTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 5px;
  border: 1px solid ${GRAY.LIGHT};
  background-color: ${GRAY.BACKGROUND};
  cursor: pointer;
  height: 20px;
`;

const TableData = styled.td<{ id: string }>`
  border: 1px solid ${GRAY.LIGHT};
  padding: 5px;
  background-color: ${WHITE};
  justify-content: center;
  align-items: center;
  min-width: 30px;

  ${({ id }) => {
    switch (id) {
      case MEMBER.GROUP:
        return `width: 70px;`;
      case MEMBER.PROFILE_IMAGE:
        return `width: 30px;`;
      case MEMBER.NAME:
        return `width: 70px;`;
      case MEMBER.GENDER:
        return `width: 50px;`;
      case MEMBER.OFFICER:
        return `width: 50px;`;
      case MEMBER.AGE:
        return `width: 50px;`;
      case MEMBER.BIRTH:
        return `width: 100px;`;
      case MEMBER.MOBILE_PHONE:
        return `width: 100px;`;

      default:
        return `width: auto;`;
    }
  }}
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

const BottomContainer = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 50px;
`;

type MemberTableProps = {
  members: Member[];
  page: number;
  onClickHeader: (id: MEMBER) => void;
  onClickMemberItem: (memberId: string) => void;
  onClickNextPage: () => void;
  onClickPrevPage: () => void;
};

const MemberTableView = ({
  members,
  page,
  onClickHeader,
  onClickMemberItem,
  onClickNextPage,
  onClickPrevPage,
}: MemberTableProps) => {
  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList,
  );
  const t = useI18n();

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.PROFILE_IMAGE:
        return (
          <ProfileImage
            src={member.profileImage || DefaultImage}
            alt={MEMBER.PROFILE_IMAGE}
          />
        );
      case MEMBER.NAME:
        return <MainText>{member.name}</MainText>;
      case MEMBER.MOBILE_PHONE:
        return (
          <MainText>{getFormattedMobilePhone(member.mobilePhone)}</MainText>
        );
      case MEMBER.GENDER:
        return <MainText>{t(member.gender as GENDER)}</MainText>;
      case MEMBER.BIRTH:
        return (
          <MainText>{member.birth && getFormattedDate(member.birth)}</MainText>
        );
      case MEMBER.AGE:
        return (
          <MainText>
            {member.birth && getAge(getDateFromString(member.birth))}
          </MainText>
        );
      case MEMBER.BAPTISM:
        return <MainText>{t(member.baptism as BAPTISM)}</MainText>;
      case MEMBER.OFFICER:
        return <MainText>{member.officerId}</MainText>;
      // case MEMBER.MINISTRY:
      //   return <MainText >{member.ministryId}</MainText>;
      // case MEMBER.EDUCATION:
      //   return <MainText >{member.educationId}</MainText>;
      default:
        return null;
    }
  };

  return (
    <Container>
      <TableContainer>
        <MemberTable>
          <thead>
            <tr>
              {memberTableHeaderItemList
                .filter((item) => item.isShown)
                .map((item) => (
                  <TableHeader key={item.id}>
                    <MemberTableHeader item={item} onClick={onClickHeader} />
                  </TableHeader>
                ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} onClick={() => onClickMemberItem(member.id)}>
                {memberTableHeaderItemList
                  .filter((item) => item.isShown)
                  .map((item) => (
                    <TableData key={item.id} id={item.id}>
                      <ContentContainer>
                        {getMemberTableContent(item.id, member)}
                      </ContentContainer>
                    </TableData>
                  ))}
              </tr>
            ))}
          </tbody>
        </MemberTable>
      </TableContainer>
      <BottomContainer>
        <Button width={30} height={20} text={"<"} onClick={onClickPrevPage} />
        <MainText>{page}</MainText>
        <Button width={30} height={20} text={">"} onClick={onClickNextPage} />
      </BottomContainer>
    </Container>
  );
};

export default MemberTableView;
