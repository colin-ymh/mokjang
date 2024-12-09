import React from "react";
import styled from "styled-components";
import Image from "next/image";

import { GRAY, WHITE } from "@/constants/styles/color";
import { Member } from "@/models/member/member";
import { MEMBER } from "@/constants/member/member-column";
import {
  BAPTISM,
  CALENDAR_MODE,
  GENDER,
  MEMBER_ORDER_BY,
  OFFICER,
  ORDER_DIRECTION,
} from "@/constants/constant";
import { MainText } from "@/components/atoms/common/text/main-text";
import { getFormattedDate, getFormattedMobilePhone } from "@/utils/format";
import { getAge, getDateFromString } from "@/utils/date";

import DefaultImage from "../../../../public/png/default-member-image.png";
import { useI18n } from "../../../../locales/client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  setMemberOrderBy,
  setMemberOrderDirection,
} from "@/redux/reducers/member-filter-reducer";

const TableContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  table-layout: auto;

  // 헤더
  th {
    padding: 5px;
    border: 1px solid ${GRAY.DEFAULT};
    background-color: ${GRAY.BACKGROUND};
    cursor: pointer;
  }

  // 바디
  td {
    border: 1px solid ${GRAY.DEFAULT};
    padding: 5px;
    background-color: ${WHITE};
    white-space: nowrap;
  }

  th,
  td {
    min-width: 80px;
  }
`;

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

type MemberTableProps = {
  members: Member[];
  onClickMemberItem: (member: Member) => void;
};

const MemberTable = ({ members, onClickMemberItem }: MemberTableProps) => {
  const t = useI18n();

  const { memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );
  const dispatch = useDispatch<AppDispatch>();

  const onClickHeader = (id: MEMBER_ORDER_BY) => {
    if (id !== memberOrderBy) {
      dispatch(setMemberOrderBy(id));
      dispatch(setMemberOrderDirection(ORDER_DIRECTION.ASC));
    } else {
      dispatch(
        setMemberOrderDirection(
          memberOrderDirection === ORDER_DIRECTION.ASC
            ? ORDER_DIRECTION.DESC
            : ORDER_DIRECTION.ASC,
        ),
      );
    }
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <th onClick={() => onClickHeader(MEMBER_ORDER_BY.NAME)}>
              <MainText fontSize={18} fontWeight={500}>
                {t(MEMBER.NAME)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.MOBILE_PHONE)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={18} fontWeight={500}>
                {t(MEMBER.GENDER)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.BIRTH)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t("age")}
              </MainText>
            </th>
            <th>
              <MainText
                fontSize={17}
              >{`${t(CALENDAR_MODE.SOLAR)}${t(CALENDAR_MODE.LUNAR)}`}</MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.BAPTISM)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.OFFICER)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.MINISTRY)}
              </MainText>
            </th>
            <th>
              <MainText fontSize={17} fontWeight={500}>
                {t(MEMBER.EDUCATION)}
              </MainText>
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member: Member) => (
            <tr key={member.id} onClick={() => onClickMemberItem(member)}>
              <td>
                <ProfileContainer>
                  <ProfileImage
                    src={member.profileImage || DefaultImage}
                    alt={MEMBER.PROFILE_IMAGE}
                  />
                  <MainText fontSize={16}>{member.name}</MainText>
                </ProfileContainer>
              </td>

              <td>
                <MainText fontSize={16}>
                  {getFormattedMobilePhone(member.mobilePhone)}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>{t(member.gender as GENDER)}</MainText>
              </td>
              <td>
                <MainText fontSize={16}>
                  {getFormattedDate(member.birth)}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>
                  {getAge(getDateFromString(member.birth))}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>
                  {t(
                    member.isLunar ? CALENDAR_MODE.LUNAR : CALENDAR_MODE.SOLAR,
                  )}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>
                  {t(member.baptism as BAPTISM)}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>
                  {t(member.officer as OFFICER)}
                </MainText>
              </td>
              <td>
                <MainText fontSize={16}>{member.ministry}</MainText>
              </td>
              <td>
                <MainText fontSize={16}>{member.education}</MainText>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default MemberTable;
