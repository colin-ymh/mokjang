import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MembersApi } from '@/api/members/members.api';
import { BLANK, MEMBER } from '@mokjang/constants';
import { FamilyMember, Member } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import AddFamilyMemberModalView from './add-family-member-modal.view';

type AddFamilyMemberModalProps = {
  familyMembers: FamilyMember[];
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
};

const AddFamilyMemberModal = ({
  familyMembers,
  selectedMembers,
  setSelectedMembers,
}: AddFamilyMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 검색어
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 커서 기반 페이징 상태
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 로딩/에러 상태
  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // fetch 이전에 초기화가 완료됐는지 플래그
  const [isResetDone, setIsResetDone] = useState(false);

  // 교인 목록 검색 (인자 없이 현재 state 사용)
  const fetchSearchedMembers = async () => {
    try {
      if (isLoading || !hasMore) return;

      setIsLoading(true);

      const response = await membersApi.getMembersV2({
        churchId,
        limit: 50,
        cursor: cursor ?? undefined,
        // 정렬 사용 시 여기에 지정
        displayColumns: [
          MEMBER.OFFICER,
          MEMBER.MOBILE_PHONE,
          MEMBER.BIRTH,
          MEMBER.GROUP,
        ],
        // 최소 2자 이상일 때만 검색어 전달 (트래픽 절감)
        search: searchName.length > 1 ? searchName : undefined,
      });

      const newMembers: Member[] = response.data?.data ?? [];

      // 중복 제거 (스크롤 중복 방지)
      const existingIds = new Set(searchedMembers.map((m) => m.id));
      const filteredNewMembers = newMembers.filter(
        (m) => !existingIds.has(m.id)
      );

      setSearchedMembers((prev) =>
        cursor ? [...prev, ...filteredNewMembers] : filteredNewMembers
      );

      // next cursor/hasMore 안전 처리
      const next = response.data?.nextCursor || null;
      setCursor(next);

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

  // 교인 목록에서 선택/해제
  const onClickMember = (targetMember: Member) => {
    setSelectedMembers((prev) => {
      const isMemberSelected = prev.some((m) => m.id === targetMember.id);
      return isMemberSelected
        ? prev.filter((m) => m.id !== targetMember.id)
        : [...prev, targetMember];
    });
  };

  // 검색어/교회 변경 시: 디바운스 후 초기화 -> fetch (2단계 패턴)
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

  return (
    <>
      <AddFamilyMemberModalView
        familyMembers={familyMembers}
        searchName={searchName}
        searchedMembers={searchedMembers}
        selectedMembers={selectedMembers}
        onChangeSearch={onChangeSearch}
        onClickMember={onClickMember}
      />
    </>
  );
};

export default AddFamilyMemberModal;
