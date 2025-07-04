import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';
import {
  fetchMembers,
  setMembers,
} from '@/redux/reducers/filter/member-filter-reducer';

import { MembersApi } from '@/api/members/members.api';
import MemberListView from '@/components/organisms/member/list/member-list.view';
import { Member } from '@/models/member/member';
import { getMemberFromServer } from '@/utils/member';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';

type MemberListProps = {
  isNewMember?: boolean;
};

const MemberList = ({ isNewMember }: MemberListProps) => {
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const { members, memberFilter, memberOrderBy, memberOrderDirection } =
    useSelector((state: RootState) => state.memberFilter);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const member = useSelector((state: RootState) => state.memberRegister.member);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadMembers = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(fetchMembers({ currentPage: page + 1 }));
      if (fetchMembers.fulfilled.match(result)) {
        const newMembers: Member[] = result.payload;
        if (newMembers.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(members.map((member) => member.id));
          const filteredNewMembers = newMembers.filter(
            (member) => !existingIds.has(member.id)
          );
          dispatch(setMembers([...members, ...filteredNewMembers]));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialMembers = async () => {
      try {
        const result = await dispatch(fetchMembers({ currentPage: 1 }));
        if (fetchMembers.fulfilled.match(result)) {
          dispatch(setMembers(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialMembers();
  }, [memberFilter, memberOrderBy, memberOrderDirection, isNewMember]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickMemberItem = async (memberId: string) => {
    try {
      const response = await membersApi.getMember({ churchId, memberId });
      const member = getMemberFromServer(response.data.data);

      dispatch(setTargetMember(member));
      dispatch(setMember(member));
      setIsMemberInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsMemberInformationShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await membersApi.deleteMember({
        churchId,
        memberId: member.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(fetchMembers({ currentPage: 1 }));
        if (fetchMembers.fulfilled.match(result)) {
          dispatch(setMembers(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setMember(DEFAULT_MEMBER));
      setIsMemberInformationShown(false);
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetMember]);

  const props = {
    list: {
      members,
      onClickMemberItem,
      loadMembers,
    },
    information: {
      isMemberInformationShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
    },
  };

  return (
    <>
      <MemberListView {...props} />
    </>
  );
};

export default MemberList;
