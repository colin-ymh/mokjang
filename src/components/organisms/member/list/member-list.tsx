import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchMembers,
  setMemberPage,
} from '@/redux/reducers/filter/member-filter-reducer';

import { MembersApi } from '@/api/members/members.api';
import MemberListView from '@/components/organisms/member/list/member-list.view';
import { DEFAULT_MEMBER } from '@/models/member/member';
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
  const {
    memberPage,
    members,
    memberFilter,
    memberOrderBy,
    memberOrderDirection,
  } = useSelector((state: RootState) => state.memberFilter);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isMemberInformationShown, setIsMemberInformationShown] =
    useState<boolean>(false);

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
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setMemberPage(memberPage + 1));
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
        await dispatch(setMemberPage(1));
        await dispatch(fetchMembers());
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
      const member = response.data.data;

      dispatch(setTargetMember(member));
      dispatch(setTargetMember(member));
      setIsMemberInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsMemberInformationShown(false);
    dispatch(setTargetMember(DEFAULT_MEMBER));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      await membersApi.deleteMember({
        churchId,
        memberId: targetMember.id,
      });

      // 초기화 후 다시 로드
      dispatch(setMemberPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchMembers());
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetMember(DEFAULT_MEMBER));
      setIsMemberInformationShown(false);
    }
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetMember]);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [memberPage]);

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
