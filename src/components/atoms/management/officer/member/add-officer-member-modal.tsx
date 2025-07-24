import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MembersApi } from '@/api/members/members.api';
import AddOfficerMemberModalView from '@/components/atoms/management/officer/member/add-officer-member-modal.view';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Officer } from '@/models/management/management';
import { getFormattedName } from '@/utils/format';
import { OfficersApi } from '@/api/management/officer/officers.api';

type AddOfficerMemberModalProps = {
  officer: Officer;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
};

const AddOfficerMemberModal = ({
  officer,
  selectedMembers,
  setSelectedMembers,
}: AddOfficerMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const officersApi = new OfficersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const [searchName, setSearchName] = useState<string>(BLANK);
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 교인 목록 검색
  const fetchSearchedMembers = async (name: string, page: number) => {
    if (name === BLANK) {
      const response = await officersApi.getOfficerUnassignedMembers({
        churchId,
        page,
        take: 30,
      });
      return response.data.data;
    } else {
      const response = await membersApi.getSimpleMembers({
        churchId,
        page,
        take: 30,
        name,
      });
      return response.data.data;
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

  const loadMembers = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const newMembers: Member[] = await fetchSearchedMembers(searchName, page);
      if (newMembers.length > 0) {
        // 기존 데이터와 합치면서 중복 제거
        const existingIds = new Set(members.map((member) => member.id));
        const filteredNewMembers = newMembers.filter(
          (member) => !existingIds.has(member.id)
        );
        setMembers([...members, ...filteredNewMembers]);
        setPage((prev) => prev + 1); // 다음 페이지로 이동
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const resetAndFetch = async () => {
        setPage(1);
        setMembers([]);

        try {
          const firstPage = await fetchSearchedMembers(searchName, 1);
          setMembers(firstPage);
          setPage(2);
        } catch (error) {
          setThrownError(
            error instanceof Error ? error : new Error(String(error))
          );
        }
      };

      resetAndFetch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);
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
      />
    </>
  );
};

export default AddOfficerMemberModal;
