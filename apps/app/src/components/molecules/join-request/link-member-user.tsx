import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import LinkMemberUserView from './link-member-user.view';
import { MembersApi } from '../../../api/members/members.api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { BLANK } from '../../../../../../packages/constants/src';
import { DEFAULT_MEMBER, Member } from '../../../models/member/member';
import { getFormattedName } from '../../../utils/format';
import { MEMBER } from '@/constants/column/member-column';

type LinkMemberUserProps = {
  prevMember?: Member;
  onChangeLinkMember: (memberId: string) => void;
};

const LinkMemberUser = ({
  prevMember,
  onChangeLinkMember,
}: LinkMemberUserProps) => {
  const membersApi = new MembersApi(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null); // ✅ 스크롤 컨테이너는 Div 기준
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 선택된 교인
  const [selectedMember, setSelectedMember] = useState<Member>(DEFAULT_MEMBER);

  // 검색어
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록 (뷰로 내려보낼 리스트)
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 페이지네이션/로딩/에러
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  // ===============================
  // 이벤트 핸들러
  // ===============================
  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(getFormattedName(event.target.value));
  };

  // 교인 목록에서 선택/해제
  const onClickMember = (member: Member) => {
    setSelectedMember(member);
  };

  // 검색 버튼 클릭 → 1페이지부터 재검색
  const onClickSearch = () => {
    setPage(1);
    fetchSearchedMembers(1, searchName);
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 선택 변경 시 상위에 알림
  useEffect(() => {
    onChangeLinkMember(selectedMember.id);
  }, [selectedMember, onChangeLinkMember]);

  // 교인 목록 검색 (페이지/이름 인자 없으면 현재 state 사용)
  const fetchSearchedMembers = async (pageArg?: number, nameArg?: string) => {
    const targetPage = pageArg ?? page;
    const targetName = nameArg ?? searchName;

    try {
      if (isLoading) return;
      setIsLoading(true);

      const response = await membersApi.getMembers({
        churchId,
        page: targetPage,
        take: 50,
        name: targetName,
        selectedColumns: [
          MEMBER.OFFICER,
          MEMBER.MOBILE_PHONE,
          MEMBER.BIRTH,
          MEMBER.GROUP,
        ],
      });

      const newMembers: Member[] = response.data.data ?? [];

      // 중복 제거 (기존 searchedMembers 기준)
      const existingIds = new Set(searchedMembers.map((m) => m.id));
      const filteredNew = newMembers.filter((m) => !existingIds.has(m.id));

      // 페이지 1이면 교체, 그 외는 이어붙이기
      setSearchedMembers((prev) =>
        targetPage === 1 ? newMembers : [...prev, ...filteredNew]
      );
    } catch (error) {
      setThrownError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = () => {
    setPage((p) => p + 1); // ✅ 함수형 업데이트로 최신값 보장
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMembers();
    }
  };

  // 검색어 변경 시 디바운스 후 페이지 1로 재검색
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchSearchedMembers(1, searchName);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, churchId]);

  // 페이지 변경 시 다음 페이지 로드
  useEffect(() => {
    if (page === 1) return; // page=1은 위 효과에서 이미 호출
    fetchSearchedMembers(page, searchName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, churchId]);

  const props = {
    searchRef,
    scrollRef,
    prevMember,
    selectedMember,
    searchName,
    searchedMembers,
    onChangeSearch,
    onClickMember,
    onClickSearch,
    onKeyDown,
    onScroll,
  };

  return (
    <>
      <LinkMemberUserView {...props} />
    </>
  );
};

export default LinkMemberUser;
