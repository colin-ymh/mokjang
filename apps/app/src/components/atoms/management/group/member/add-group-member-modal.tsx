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
import { BLANK } from '@mokjang/constants';
import { Member } from '@mokjang/models';
import { Group } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import { GroupsApi } from '../../../../../api/management/group/groups.api';
import { MEMBER } from '@mokjang/constants';

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
      if (isLoading) return;
      setIsLoading(true);
      const response = await membersApi.getMembers({
        churchId,
        page: 1,
        take: 50,
        name: searchName,
        selectedColumns: [
          MEMBER.OFFICER,
          MEMBER.MOBILE_PHONE,
          MEMBER.BIRTH,
          MEMBER.GROUP,
        ],
      });
      const newMembers: Member[] = response.data.data;
      const existingIds = new Set(members.map((member) => member.id));
      const filteredNewMembers = newMembers.filter(
        (member) => !existingIds.has(member.id)
      );

      const updatedMembers =
        page === 1 ? newMembers : [...members, ...filteredNewMembers];

      setMembers(updatedMembers);
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
    setPage(page + 1);
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
      setPage(1);
      fetchSearchedMembers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  useEffect(() => {
    fetchSearchedMembers();
  }, [page]);

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
