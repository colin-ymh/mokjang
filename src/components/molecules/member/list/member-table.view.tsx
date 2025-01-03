import React, { MutableRefObject } from "react";
import Image from "next/image";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { GRAY, WHITE } from "@/constants/styles/color";
import { MEMBER } from "@/constants/member/member-column";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BAPTISM, GENDER } from "@/constants/constant";
import { getAge, getDateFromString } from "@/utils/date";
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
  getKRDateFromDashDate,
} from "@/utils/format";
import { Member } from "@/models/member/member";
import MemberTableHeader from "@/components/atoms/member/list/member-table-header";
import useWindowSize from "@/hooks/window/window";

import DefaultImage from "../../../../../public/png/default-member-image.png";
import { useI18n } from "../../../../../locales/client";

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden; /* 부모 영역 초과 스크롤 방지 */
  //width: 90%;
  //height: 90%; /* 부모 높이에 맞게 고정 */
  //border-radius: 5px;
`;

const MemberTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 열 크기 고정 */
`;

const TableHeader = styled.th`
  padding: 5px;
  border: 1px solid ${GRAY.LIGHT};
  border-left: 0;
  background-color: ${GRAY.BACKGROUND}
  cursor: pointer;
  height: 20px;
`;

const Scroll = styled.div<{ height: number }>`
  width: 100%;
  height: ${({ height }) => `${height - 200}px`};
  overflow-y: auto;
  position: relative;
  flex-shrink: 0; /* 자식 콘텐츠 크기와 관계없이 고정 */
`;

const MemberTableRow = styled.tr`
  &:hover td {
    background-color: ${GRAY.LIGHT};
  }
`;

const TableData = styled.td<{ id: string; $index: number }>`
  border-bottom: 1px solid ${GRAY.LIGHT};
  border-right: 1px solid ${GRAY.LIGHT};
  padding: 5px;
  background-color: ${({ $index }) =>
    $index % 2 === 0 ? WHITE : GRAY.SIDE_BAR};
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  overflow: hidden;
`;

const ProfileImage = styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 5px;
`;

type MemberTableProps = {
  members: Member[];
  onClickHeader: (id: MEMBER) => void;
  onClickMemberItem: (memberId: string) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  onScroll: () => void;
};

const MemberTableView = ({
  members,
  onClickHeader,
  onClickMemberItem,
  scrollRef,
  onScroll,
}: MemberTableProps) => {
  const { height } = useWindowSize();
  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList,
  );
  const t = useI18n();

  const getMemberTableContent = (id: MEMBER, member: Member) => {
    switch (id) {
      case MEMBER.GROUP:
        return <MainText>{member.group?.name}</MainText>;
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
          <MainText>
            {member.birth &&
              getKRDateFromDashDate(getFormattedDate(member.birth))}
          </MainText>
        );
      case MEMBER.AGE:
        return (
          <MainText>
            {member.birth && getAge(getDateFromString(member.birth))}
          </MainText>
        );
      case MEMBER.BAPTISM:
        return <MainText>{t(member?.baptism as BAPTISM)}</MainText>;
      case MEMBER.OFFICER:
        return <MainText>{member.officer?.name}</MainText>;
      case MEMBER.MINISTRIES:
        return (
          <MainText>
            {member.ministries?.map((item) => {
              return item.name;
            })}
          </MainText>
        );
      case MEMBER.EDUCATIONS:
        return (
          <MainText>
            {member.educations?.map((item) => {
              return item.name;
            })}
          </MainText>
        );
      case MEMBER.HOME_PHONE:
        return (
          <MainText>
            {member.homePhone && getFormattedHomePhone(member.homePhone)}
          </MainText>
        );
      case MEMBER.ADDRESS:
        return <MainText>{member.address}</MainText>;
      case MEMBER.OCCUPATION:
        return <MainText>{member.occupation}</MainText>;
      case MEMBER.SCHOOL:
        return <MainText>{member.school}</MainText>;
      case MEMBER.MARRIAGE:
        return <MainText>{t(member.marriage)}</MainText>;
      case MEMBER.REGISTERED_AT:
        return (
          <MainText>
            {member.registeredAt &&
              getKRDateFromDashDate(getFormattedDate(member.registeredAt))}
          </MainText>
        );
      case MEMBER.UPDATED_AT:
        return (
          <MainText>
            {member.updatedAt &&
              getKRDateFromDashDate(getFormattedDate(member.updatedAt))}
          </MainText>
        );
      default:
        return null;
    }
  };

  return (
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
      </MemberTable>

      <Scroll ref={scrollRef} onScroll={onScroll} height={height}>
        <MemberTable>
          <tbody>
            {members.map((member, index) => (
              <MemberTableRow
                key={member.id}
                onClick={() => onClickMemberItem(member.id)}
              >
                {memberTableHeaderItemList
                  .filter((item) => item.isShown)
                  .map((item) => (
                    <TableData key={item.id} id={item.id} $index={index}>
                      <ContentContainer>
                        {getMemberTableContent(item.id, member)}
                      </ContentContainer>
                    </TableData>
                  ))}
              </MemberTableRow>
            ))}
          </tbody>
        </MemberTable>
      </Scroll>
    </TableContainer>
  );
};

export default MemberTableView;
