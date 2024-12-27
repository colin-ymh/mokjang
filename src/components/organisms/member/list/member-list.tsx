import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import { MembersApi } from "@/api/churches/members.api";
import MemberInformation from "@/components/organisms/member/information/member-information";
import CustomPopup from "@/components/atoms/common/popup/custom-popup";
import MemberListView from "@/components/organisms/member/list/member-list.view";
import { Member } from "@/models/member/member";
import { NULL } from "@/constants/constant";
import {
  DEFAULT_MEMBER,
  setMember,
} from "@/redux/reducers/member-register-reducer";
import styled from "styled-components";
import Button from "@/components/atoms/common/button/button";
import { getMemberFromServer } from "@/utils/member";
import { MEMBER } from "@/constants/member/member-column";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const MemberList = () => {
  const membersApi = new MembersApi(false);
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

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 서버로부터 교인 목록을 받아와서, 클라이언트에 적합하게 변환
  const getMembersFromServer = async (
    currentPage: number,
  ): Promise<Member[]> => {
    if (!churchId) {
      return [];
    }

    let order = memberOrderBy;
    if (order === MEMBER.AGE) order = MEMBER.BIRTH;

    try {
      const response = await membersApi.getMembers({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤에 적합한 소량의 데이터 요청
        order: order !== NULL ? order : undefined,
        orderDirection: memberOrderDirection,
        selectedColumns: memberFilter.selectedColumns,
        name: memberFilter.name,
        school: memberFilter.school,
        birthAfter: memberFilter.birthAfter,
        birthBefore: memberFilter.birthBefore,
        group: memberFilter.group,
        officer: memberFilter.officer,
      });

      return response.data.data;
    } catch (error) {
      console.error("교인 목록 불러오기 실패", error);
      return [];
    }
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadMembers = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    await getMembersFromServer(page + 1).then((newMembers) => {
      if (newMembers.length > 0) {
        setMembers((prev) => {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(prev.map((member) => member.id));
          const filteredNewMembers = newMembers.filter(
            (member) => !existingIds.has(member.id),
          );
          return [...prev, ...filteredNewMembers];
        });
        setPage((prev) => prev + 1); // 다음 페이지로 이동
      }
    });

    setIsLoading(false);
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    getMembersFromServer(1).then((members) => {
      setMembers(members);
      setPage(1);
    });
  }, [churchId, memberFilter, memberOrderBy, memberOrderDirection]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickMemberItem = (memberId: string) => {
    membersApi.getMember({ churchId, memberId }).then((response) => {
      const member = getMemberFromServer(response.data.data);

      setTargetMember(member);
      dispatch(setMember(member));
      setIsMemberInformationShown(true);
    });
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
        if (response.status === 200) {
          // 초기화 후 다시 로드
          setPage(1);
          setMembers([]);
          loadMembers();
        }
      });
    dispatch(setMember(DEFAULT_MEMBER));
    setIsMemberInformationShown(false);
  };

  const props = {
    members,
    onClickMemberItem,
    loadMembers,
  };

  return (
    <>
      <MemberListView {...props} />
      {/* 교인 상세정보 팝업*/}
      <CustomPopup
        isShow={isMemberInformationShown}
        onClickClose={onClickClose}
        width={70}
        height={90}
        isPercentage={true}
        headerRight={
          <ButtonContainer>
            <Button text={"삭제"} onClick={onClickDelete} />
          </ButtonContainer>
        }
      >
        <MemberInformation targetMember={targetMember} />
      </CustomPopup>
    </>
  );
};

export default MemberList;
