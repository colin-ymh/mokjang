import React from "react";
import styled from "styled-components";

import { GRAY, WHITE } from "@/constants/styles/color";
import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";
import { MainText } from "@/components/atoms/common/text/main-text";
import { useMemberTableItems } from "@/hooks/table/table-header";
import DefaultImage from "../../../../public/png/default-member-image.png";
import { getFormattedDate, getFormattedMobilePhone } from "@/utils/format";
import { BAPTISM, GENDER } from "@/constants/constant";
import { getAge, getDateFromString } from "@/utils/date";
import Image from "next/image";
import { useI18n } from "../../../../locales/client";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const TableContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
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

type MemberTableProps = {
  members: Member[];
  onClickMemberItem: (member: Member) => void;
  onClickHeader: (id: MEMBER) => void;
};

const MemberTableView = ({
  members,
  onClickMemberItem,
  onClickHeader,
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
    </TableContainer>
  );
};

export default MemberTableView;
