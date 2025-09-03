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

import { BLANK } from '@mokjang/constants';
import { Member } from '@mokjang/models';
import { Ministry, MinistryGroup } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import AddMinistryGroupMemberModalView from './add-ministry-group-member-modal.view';
import { MinistryGroupMembersApi } from '../../../../../api/management/ministry/ministry-group-members.api';
import { MinistryGroupsApi } from '../../../../../api/management/ministry/ministry-groups.api';

type AddMinistryGroupMemberModalProps = {
  ministryGroup: MinistryGroup;
  startDate: Date | null;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  ministries: Ministry[];
  onChangeStartDate: (date: Date | null) => void;
};

const AddMinistryGroupMemberModal = ({
  ministryGroup,
  startDate,
  selectedMembers,
  setSelectedMembers,
  ministries,
  onChangeStartDate,
}: AddMinistryGroupMemberModalProps) => {
  const ministryGroupMembersApi = new MinistryGroupMembersApi(false);
  const ministryGroupsApi = new MinistryGroupsApi(false);
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

  const fetchSearchedMembers = async (name: string, page: number) => {
    if (name === BLANK) {
      const response =
        await ministryGroupsApi.getMinistryGroupUnassignedMembers({
          churchId,
          page,
          take: 50,
        });
      return response.data.data;
    } else {
      const response =
        await ministryGroupMembersApi.getMinistryGroupMembersSearch({
          ministryGroupId: ministryGroup.id as string,
          churchId,
          page,
          take: 50,
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
      <AddMinistryGroupMemberModalView
        searchName={searchName}
        searchedMembers={members}
        selectedMembers={selectedMembers}
        onChangeSearch={onChangeSearch}
        onClickMember={onClickMember}
        ministries={ministries}
        startDate={startDate}
        onChangeStartDate={onChangeStartDate}
        scrollRef={scrollRef}
        onScroll={onScroll}
      />
    </>
  );
};

export default AddMinistryGroupMemberModal;
