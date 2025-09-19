import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import LinkMemberUserView from './link-member-user.view';
import { MembersApi } from '@/api/members/members.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { BLANK, MEMBER } from '@mokjang/constants';
import { DEFAULT_MEMBER, Member } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';

type LinkMemberUserProps = {
  prevMember?: Member;
  onChangeLinkMember: (member: Member) => void;
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

  // 커서 기반 페이지네이션/로딩/에러
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  // fetch 이전에 초기화가 완료됐는지 플래그
  const [isResetDone, setIsResetDone] = useState(false);

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

  // 검색 버튼 클릭 → 초기화 후 재검색
  const onClickSearch = () => {
    // 1단계: 상태 초기화
    setSearchedMembers([]);
    setCursor(null);
    setHasMore(true);
    setIsResetDone(true); // 초기화 완료 신호
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 선택 변경 시 상위에 알림
  useEffect(() => {
    onChangeLinkMember(selectedMember);
  }, [selectedMember, onChangeLinkMember]);

  // 교인 목록 검색 (인자 없이 현재 state 사용)
  const fetchSearchedMembers = async () => {
    try {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      const response = await membersApi.getMembersV2({
        churchId,
        limit: 50,
        cursor: cursor ?? undefined,
        // 필요 시 정렬 지정: sortBy, sortDirection
        displayColumns: [
          MEMBER.OFFICER,
          MEMBER.MOBILE_PHONE,
          MEMBER.BIRTH,
          MEMBER.GROUP,
        ],
        // 너무 짧은 검색어는 생략해 트래픽 절감
        search: searchName.length > 1 ? searchName : undefined,
      });

      const newMembers: Member[] = response.data?.data ?? [];

      // 중복 제거 (기존 searchedMembers 기준)
      const existingIds = new Set(searchedMembers.map((m) => m.id));
      const filteredNew = newMembers.filter((m) => !existingIds.has(m.id));

      // 커서가 null(초기 로드)이면 교체, 아니면 이어붙이기
      setSearchedMembers((prev) =>
        cursor ? [...prev, ...filteredNew] : filteredNew
      );

      // next cursor / hasMore 처리(필드명 방어 코딩)
      const next = response.data?.nextCursor || null;
      setCursor(next);

      setHasMore(response.data.hasMore);
    } catch (error) {
      setThrownError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = () => {
    if (!isLoading && hasMore) {
      fetchSearchedMembers();
    }
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMembers();
    }
  };

  // 검색어 변경 시 디바운스 후 초기화 → fetch(2단계 보장)
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1단계: 상태 초기화
      setSearchedMembers([]);
      setCursor(null);
      setHasMore(true);
      setIsResetDone(true); // 초기화 완료 신호
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, churchId]);

  // 2단계: 초기화 완료 후 fetch 실행
  useEffect(() => {
    if (isResetDone) {
      fetchSearchedMembers();
      setIsResetDone(false); // 다음 사이클 대비
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetDone]);

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
