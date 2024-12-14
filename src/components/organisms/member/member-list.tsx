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

  const TAKE = 12;

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  const getMembersFromServer = async (page: number): Promise<Member[]> => {
    if (!churchId) {
      return [];
    }

    try {
      const response = await membersApi.getMembers({
        churchId,
        page,
        take: TAKE,
        order: memberOrderBy !== NULL ? memberOrderBy : undefined,
        orderDirection: memberOrderDirection,
        name: memberFilter.name,
        school: memberFilter.school,
        vehicleNumber: memberFilter.vehicleNumber,
        gender: memberFilter.gender !== NULL ? memberFilter.gender : undefined,
        birthAfter: memberFilter.birthAfter || undefined,
        birthBefore: memberFilter.birthBefore || undefined,
        baptism:
          memberFilter.baptism !== NULL ? memberFilter.baptism : undefined,
      });

      return response.data.data;
    } catch (error) {
      console.error("교인 목록 불러오기 실패", error);
      throw new Error("교인 목록 불러오기 실패");
    }
  };

  // 필터 정보가 변경될 때, 교인 목록을 서버에서 새로 불러옴
  useEffect(() => {
    getMembersFromServer(page).then((members) => setMembers(members));
  }, [churchId, memberFilter, memberOrderBy, memberOrderDirection]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickMemberItem = (member: Member) => {
    const newMember: Member = {
      ...member,
      birth: member.birth && getFormattedDate(member.birth),
      mobilePhone:
        member.mobilePhone && getFormattedMobilePhone(member.mobilePhone),
      homePhone: member.homePhone && getFormattedHomePhone(member.homePhone),
    };

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
    membersApi
      .deleteMember({ churchId, memberId: member.id })
      .then((response) => {
        // 삭제 성공 시
        if (response.status === 200) {
          // 교인 목록 초기화
          getMembersFromServer(page).then((members) => setMembers(members));
        }
      });
    dispatch(setMember(DEFAULT_MEMBER));
    setIsMemberInformationShown(false);
  };

  // 교인 정보 업데이트
  const onClickEdit = async () => {
    try {
      // 기본 정보 업데이트
      await membersApi.editMember(
        { churchId, memberId: member.id },
        getEditMemberBody(member),
      );

      // 직분 업데이트
      if (targetMember.officerId !== member.officerId) {
        if (member.officerId === NULL) {
          await memberSettingsApi.editMemberOfficer(
            { churchId, memberId: member.id },
            { isDeleteOfficer: true },
          );
        } else {
          await memberSettingsApi.editMemberOfficer(
            { churchId, memberId: member.id },
            {
              isDeleteOfficer: false,
              officerId: member.officerId,
              officerStartChurch: member.officerStartChurch,
              officerStartDate: member.officerStartDate,
            },
          );
        }
      }

      // 사역 업데이트
      if (targetMember.ministryId !== member.ministryId) {
        if (member.ministryId === NULL) {
          await memberSettingsApi.editMemberMinistry(
            { churchId, memberId: member.id },
            { isDeleteMinistry: true },
          );
        } else {
          await memberSettingsApi.editMemberMinistry(
            { churchId, memberId: member.id },
            {
              isDeleteMinistry: false,
              ministryId: member.ministryId,
            },
          );
        }
      }

      // 교육이수 업데이트
      if (targetMember.educationId !== member.educationId) {
        if (member.educationId === NULL) {
          await memberSettingsApi.editMemberEducation(
            { churchId, memberId: member.id },
            { isDeleteEducation: true },
          );
        } else {
          await memberSettingsApi.editMemberEducation(
            { churchId, memberId: member.id },
            {
              isDeleteEducation: false,
              educationId: member.educationId,
            },
          );
        }
      }

      // 소그룹 업데이트
      if (targetMember.groupId !== member.groupId) {
        if (member.groupId === NULL) {
          await memberSettingsApi.editMemberGroup(
            { churchId, memberId: member.id },
            { isDeleteGroup: true },
          );
        } else {
          await memberSettingsApi.editMemberGroup(
            { churchId, memberId: member.id },
            {
              isDeleteGroup: false,
              groupId: member.groupId,
            },
          );
        }
      }

      // 모든 작업이 성공했을 경우에만 목록 갱신
      getMembersFromServer(page).then((members) => setMembers(members));
    } catch (error) {
      throw new Error("교인 정보 업데이트 실.");
    }
  };

  // 테이블 다음 페이지 이동
  const onClickNextPage = () => {
    getMembersFromServer(page + 1).then((members) => {
      if (members.length !== 0) {
        setPage(page + 1);
        setMembers(members);
      }
    });
  };

  // 테이블 이전 페이지 이동
  const onClickPrevPage = () => {
    if (page <= 1) return;

    getMembersFromServer(page - 1).then((members) => {
      setPage(page - 1);
      setMembers(members);
    });
  };

  const props = {
    members,
    page,
    onClickMemberItem,
    onClickNextPage,
    onClickPrevPage,
  };

  return (
    <>
      <MemberListView {...props} />
      {/* 교인 상세정보 팝업*/}
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
        width={50}
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
