import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { MembersApi } from '../../../../../api/members/members.api';
import AddOfficerMemberModalView from './add-officer-member-modal.view';
import { BLANK } from '@mokjang/constants';
import { Member, Officer } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import { OfficersApi } from '../../../../../api/management/officer/officers.api';

type AddOfficerMemberModalProps = {
  officer: Officer;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  startDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
};

const AddOfficerMemberModal = ({
  officer,
  selectedMembers,
  setSelectedMembers,
  startDate,
  onChangeStartDate,
}: AddOfficerMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const officersApi = new OfficersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const [searchName, setSearchName] = useState<string>(BLANK);
  const [members, setMembers] = useState<Member[]>([]);

  // 페이지 기반(담당자 미배정 목록) 상태
  const [page, setPage] = useState(1);

  // 커서 기반(검색 결과) 상태
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isResetDone, setIsResetDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 교인 목록 검색
  const fetchSearchedMembers = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);

      // 검색어가 없을 때: 담당자 미배정 목록(페이지 기반)
      if (searchName === BLANK) {
        const response = await officersApi.getOfficerUnassignedMembers({
          churchId,
          page,
          take: 30,
        });

        const newMembers: Member[] = response.data?.data ?? [];
        // 중복 제거
        const existingIds = new Set(members.map((m) => m.id));
        const filtered = newMembers.filter((m) => !existingIds.has(m.id));

        setMembers((prev) =>
          page === 1 ? newMembers : [...prev, ...filtered]
        );
        // 페이지 기반에서는 hasMore/cursor를 사용하지 않음
      } else {
        // 검색어가 있을 때: 간단 목록 v2(커서 기반)
        const response = await membersApi.getSimpleMembersV2({
          churchId,
          limit: 30,
          cursor: cursor ?? undefined,
          name: searchName,
          // 필요시 정렬 사용 시 아래 추가
          // sort: 'name',
          // sortDirection: 'asc',
        });

        const newMembers: Member[] = response.data?.data ?? [];

        const existingIds = new Set(members.map((m) => m.id));
        const filtered = newMembers.filter((m) => !existingIds.has(m.id));

        setMembers((prev) => (cursor ? [...prev, ...filtered] : filtered));

        const next = response.data?.nextCursor || null;
        setCursor(next);

        setHasMore(response.data.hasMore);
      }
    } catch (error) {
      setThrownError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchName(getFormattedName(event.target.value));
  };

  const onClickMember = (targetMember: Member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === targetMember.id);
      return isSelected
        ? prev.filter((m) => m.id !== targetMember.id)
        : [...prev, targetMember];
    });
  };

  const loadMembers = () => {
    // 검색어 없으면 페이지 +1, 검색어 있으면 커서 기반 추가 로드
    if (searchName === BLANK) {
      setPage((p) => p + 1);
    } else {
      if (!isLoading && hasMore) {
        fetchSearchedMembers();
      }
    }
  };

  const onScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMembers();
      }
    }
  };

  // 검색어 변경 시 디바운스 후 초기화 → fetch (2단계 보장)
  useEffect(() => {
    const timer = setTimeout(() => {
      // 상태 초기화
      setMembers([]);

      if (searchName === BLANK) {
        // 페이지 기반 초기화
        setPage(1);
        // 커서 상태는 의미 없지만 혹시 모를 혼선 방지
        setCursor(null);
        setHasMore(true);
      } else {
        // 커서 기반 초기화
        setCursor(null);
        setHasMore(true);
        // 페이지는 의미 없지만 혼선 방지
        setPage(1);
      }

      setIsResetDone(true); // 초기화 완료 신호
    }, 500);

    return () => clearTimeout(timer);
  }, [searchName, churchId]);

  // 초기화 완료 후 fetch 실행
  useEffect(() => {
    if (isResetDone) {
      fetchSearchedMembers();
      setIsResetDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetDone]);

  // 페이지 변경 시(검색어 없을 때만 의미 있음) 다음 페이지 로드
  useEffect(() => {
    if (searchName !== BLANK) return; // 검색 모드에서는 page 무시
    if (page === 1) return; // page=1은 위 2단계에서 호출됨
    fetchSearchedMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <AddOfficerMemberModalView
        scrollRef={scrollRef}
        officer={officer}
        searchName={searchName}
        searchedMembers={members}
        selectedMembers={selectedMembers}
        onChangeSearch={onChangeSearch}
        onClickMember={onClickMember}
        onScroll={onScroll}
        startDate={startDate}
        onChangeStartDate={onChangeStartDate}
      />
    </>
  );
};

export default AddOfficerMemberModal;
