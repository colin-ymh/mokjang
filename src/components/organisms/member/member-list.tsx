import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { MembersApi } from "@/api/churches/members.api";
import MemberInformation from "@/components/organisms/member/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberListView from "@/components/organisms/member/member-list.view";
import { Member } from "@/models/member/member";
import { NULL } from "@/constants/constant";
import {
  DEFAULT_MEMBER,
  setMember,
} from "@/redux/reducers/member-register-reducer";
import {
  getFormattedDate,
  getFormattedHomePhone,
  getFormattedMobilePhone,
} from "@/utils/format";
import styled from "styled-components";
import Button from "@/components/atoms/common/button/button";
import { getEditMemberBody } from "@/utils/member";
import { MemberSettingsApi } from "@/api/churches/member-settings.api";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const MemberList = () => {
  const membersApi = new MembersApi(false);
  const memberSettingsApi = new MemberSettingsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );
  const { memberFilter, memberOrderBy, memberOrderDirection } = useSelector(
    (state: RootState) => state.memberFilter,
  );
  const member = useSelector((state: RootState) => state.memberRegister.member);

  // 실제 교인 정보
  const [targetMember, setTargetMember] = useState<Member>(DEFAULT_MEMBER);

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 교인 목록에 보여지는 교인들
  const [members, setMembers] = useState<Member[]>([]);

  // 필터 정보가 변경될 때, 교인 목록을 서버에서 새로 불러옴
  useEffect(() => {
    membersApi
      .getMembers({
        churchId,
        take: 100,
        page: 1,
        order: memberOrderBy !== NULL ? memberOrderBy : undefined,
        orderDirection: memberOrderDirection,
        name: memberFilter.name,
        school: memberFilter.school,
        vehicleNumber: memberFilter.vehicleNumber,
        gender: memberFilter.gender !== NULL ? memberFilter.gender : undefined,
        birthAfter: memberFilter.birthAfter
          ? memberFilter.birthAfter
          : undefined,
        birthBefore: memberFilter.birthBefore
          ? memberFilter.birthBefore
          : undefined,
        baptism:
          memberFilter.baptism !== NULL ? memberFilter.baptism : undefined,
      })
      .then((response) => setMembers(response.data.data));
  }, [memberFilter, memberOrderBy, memberOrderDirection]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickMemberItem = (member: Member) => {
    const newMember: Member = {
      ...member,
      birth: member.birth && getFormattedDate(member.birth),
      mobilePhone:
        member.mobilePhone && getFormattedMobilePhone(member.mobilePhone),
      homePhone: member.homePhone && getFormattedHomePhone(member.homePhone),
    };

    console.log(newMember);
    // 기존 정보를 담아서 저장해두기
    setTargetMember(newMember);

    // 교인 수정용
    dispatch(setMember(newMember));

    // 상세페이지 열기
    setIsMemberInformationShown(true);
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsMemberInformationShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  // 교인 삭제하기
  const onClickDelete = () => {
    membersApi.deleteMember({ churchId, memberId: member.id });
    dispatch(setMember(DEFAULT_MEMBER));
    setIsMemberInformationShown(false);
  };

  // 교인 정보 업데이트
  const onClickEdit = () => {
    // 기본 정보 업데이트
    membersApi.editMember(
      { churchId, memberId: member.id },
      getEditMemberBody(member),
    );

    // 직분 업데이트
    if (targetMember.officer !== member.officer) {
      // 직분 삭제
      if (member.officer === NULL) {
        memberSettingsApi.editMemberOfficer(
          { churchId, memberId: member.id },
          { isDeleteOfficer: true },
        );
      }
      // 직분 수정
      else {
        memberSettingsApi.editMemberOfficer(
          { churchId, memberId: member.id },
          {
            isDeleteOfficer: false,
            officerId: member.officer,
            officerStartChurch: member.officerStartChurch,
            officerStartDate: member.officerStartDate,
          },
        );
      }
    }

    // 사역 업데이트
    if (targetMember.ministry !== member.ministry) {
      // 사역 삭제
      if (member.ministry === NULL) {
        memberSettingsApi.editMemberMinistry(
          { churchId, memberId: member.id },
          { isDeleteMinistry: true },
        );
      }
      // 사역 수정
      else {
        memberSettingsApi.editMemberMinistry(
          { churchId, memberId: member.id },
          {
            isDeleteMinistry: false,
            ministryId: member.ministry,
          },
        );
      }
    }

    // 교육이수 업데이트
    if (targetMember.education !== member.education) {
      // 교육이수 삭제
      if (member.education === NULL) {
        memberSettingsApi.editMemberEducation(
          { churchId, memberId: member.id },
          { isDeleteEducation: true },
        );
      }
      // 교육이수 수정
      else {
        memberSettingsApi.editMemberEducation(
          { churchId, memberId: member.id },
          {
            isDeleteEducation: false,
            educationId: member.education,
          },
        );
      }
    }

    // 소그룹 업데이트
    if (targetMember.group !== member.group) {
      // 소그룹 삭제
      if (member.group === NULL) {
        memberSettingsApi.editMemberGroup(
          { churchId, memberId: member.id },
          { isDeleteGroup: true },
        );
      }
      // 소그룹 수정
      else {
        memberSettingsApi.editMemberGroup(
          { churchId, memberId: member.id },
          {
            isDeleteGroup: false,
            groupId: member.group,
          },
        );
      }
    }
  };

  const props = {
    members,
    onClickMemberItem,
  };

  return (
    <>
      <MemberListView {...props} />
      {/* 교인 상세정보 팝업*/}
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
        width={60}
        height={90}
        isPercentage={true}
        headerRight={
          <ButtonContainer>
            <Button text={"삭제"} onClick={onClickDelete} />
            <Button text={"저장"} onClick={onClickEdit} />
          </ButtonContainer>
        }
      >
        <MemberInformation />
      </CustomPopup>
    </>
  );
};

export default MemberList;
