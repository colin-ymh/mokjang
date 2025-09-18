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
import AddGroupMemberModalView from './add-group-member-modal.view';
import { BLANK, MEMBER } from '@mokjang/constants';
import { Group, Member } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import { GroupsApi } from '../../../../../api/management/group/groups.api';

type AddGroupMemberModalProps = {
  group: Group;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  startDate: Date | null;
  onChangeStartDate: (date: Date | null) => void;
};

const AddGroupMemberModal = ({
  group,
  selectedMembers,
  setSelectedMembers,
  startDate,
  onChangeStartDate,
}: AddGroupMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const groupsApi = new GroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const [searchName, setSearchName] = useState<string>(BLANK);
  const [members, setMembers] = useState<Member[]>([]);
  // 커서 기반으로 전환
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 교인 목록 검색
  const fetchSearchedMembers = async () => {
    try {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      const response =
        searchName.length > 1
          ? await membersApi.getMembersV2({
              churchId,
              limit: 50,
              cursor: cursor ?? undefined,
              sortBy: undefined,
              sortDirection: undefined,
              displayColumns: [
                MEMBER.OFFICER,
                MEMBER.MOBILE_PHONE,
                MEMBER.BIRTH,
                MEMBER.GROUP,
              ],
              search: searchName,
            })
          : await groupsApi.getGroupUnassignedMember({
              churchId,
              take: 50,
              page,
            });

      const newMembers: Member[] = response.data?.data ?? [];

      // 중복 제거 (스크롤 중복 방지)
      const existingIds = new Set(members.map((m) => m.id));
      const filteredNewMembers = newMembers.filter(
        (m) => !existingIds.has(m.id)
      );

      setMembers((prev) =>
        cursor ? [...prev, ...filteredNewMembers] : filteredNewMembers
      );

      const next = response.data?.nextCursor || null;

      setCursor(next);
      setPage(page + 1);
      setHasMore(response.data.hasMore);
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

  // 커서 기반: 더 불러오기
  const loadMembers = () => {
    if (!isLoading && hasMore) {
      fetchSearchedMembers();
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

  // 검색어 변경 시 초기화 후 재조회 (디바운스 500ms 유지)
  const [isResetDone, setIsResetDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 1단계: 상태 초기화
      setHasMore(true);
      setMembers([]);
      setCursor(null);
      setPage(1);
      setIsResetDone(true); // 초기화 완료 표시
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, churchId]);

  // 2단계: 초기화 완료 시 fetch 실행
  useEffect(() => {
    if (isResetDone) {
      fetchSearchedMembers();
      setIsResetDone(false); // 다음 사이클 대비 초기화
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResetDone]);

  // 최초 마운트 시 1회 로드
  useEffect(() => {
    setMembers([]);
    setCursor(null);
    setHasMore(true);
    setPage(1);
    fetchSearchedMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId]);

  return (
    <>
      <AddGroupMemberModalView
        scrollRef={scrollRef}
        group={group}
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

export default AddGroupMemberModal;
