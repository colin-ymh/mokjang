import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { GRAY, WHITE } from "@/constants/styles/color";
import { MEMBER } from "@/constants/member/member-column";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BAPTISM, GENDER } from "@/constants/constant";
import Button from "@/components/atoms/common/button/button";
import { getAge, getDateFromString } from "@/utils/date";
import { getFormattedDate, getFormattedMobilePhone } from "@/utils/format";
import { Member } from "@/models/member/member";
import { useMemberTableItems } from "@/hooks/table/table-header";
import DefaultImage from "../../../../public/png/default-member-image.png";
import { useI18n } from "../../../../locales/client";

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  align-items: center;
  gap: 10px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 5px;
  margin-right: 8px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  table-layout: auto;

  // 헤더
  th {
    padding: 5px 5px 5px 10px;
    border: 1px solid ${GRAY.LIGHT};
    background-color: ${GRAY.BACKGROUND};
    cursor: pointer;
  }

  // 바디
  td {
    border: 1px solid ${GRAY.LIGHT};
    padding: 5px 5px 5px 10px;
    background-color: ${WHITE};
    white-space: nowrap;
  }

  th,
  td {
    min-width: 80px;
  }
`;

const BottomContainer = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

type MemberTableProps = {
  members: Member[];
  page: number;
  onClickMemberItem: (member: Member) => void;
  onClickHeader: (id: MEMBER) => void;
  onClickNextPage: () => void;
  onClickPrevPage: () => void;
};

const MemberTableView = ({
  members,
  page,
  onClickMemberItem,
  onClickHeader,
  onClickNextPage,
  onClickPrevPage,
}: MemberTableProps) => {
  const t = useI18n();
  const tableHeaderItems = useMemberTableItems();
  const { officers } = useSelector((state: RootState) => state.church);

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.NAME:
        return (
          <ProfileContainer>
            <ProfileImage
              src={member.profileImage || DefaultImage}
              alt={MEMBER.PROFILE_IMAGE}
            />
            <MainText fontSize={16}>{member.name}</MainText>
          </ProfileContainer>
        );
      case MEMBER.MOBILE_PHONE:
        return (
          <MainText fontSize={16}>
            {getFormattedMobilePhone(member.mobilePhone)}
          </MainText>
        );
      case MEMBER.GENDER:
        return <MainText fontSize={16}>{t(member.gender as GENDER)}</MainText>;
      case MEMBER.BIRTH:
        return (
          <MainText fontSize={16}>
            {`${getFormattedDate(member.birth)} (${getAge(getDateFromString(member.birth))}세)`}
          </MainText>
        );
      case MEMBER.BAPTISM:
        return (
          <MainText fontSize={16}>{t(member.baptism as BAPTISM)}</MainText>
        );
      case MEMBER.OFFICER:
        return <MainText fontSize={16}>{member.officerId}</MainText>;
      case MEMBER.MINISTRY:
        return <MainText fontSize={16}>{member.ministryId}</MainText>;
      case MEMBER.EDUCATION:
        return <MainText fontSize={16}>{member.educationId}</MainText>;
      default:
        return null;
    }
  };
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {tableHeaderItems.map((item) => (
              <th
                key={item.id}
                onClick={() => item.isSortable && onClickHeader(item.id)}
              >
                <MainText>{item.title}</MainText>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} onClick={() => onClickMemberItem(member)}>
              {tableHeaderItems.map((item) => (
                <td key={item.id}>{getMemberTableContent(item.id, member)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <BottomContainer>
        <Button width={30} height={30} text={"<"} onClick={onClickPrevPage} />
        <MainText>{page}</MainText>
        <Button width={30} height={30} text={">"} onClick={onClickNextPage} />
      </BottomContainer>
    </TableContainer>
  );
};

export default MemberTableView;
