import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { BLANK } from '../../../../constants/constant';
import { Member } from '../../../../models/member/member';
import { getFormattedName } from '../../../../utils/format';
import AddEnrollmentMemberModalView from './add-enrollment-member-modal.view';
import { EducationEnrollmentsApi } from '../../../../api/education/education-enrollments.api';

type AddMinistryGroupMemberModalProps = {
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
};

const AddEnrollmentMemberModal = ({
  selectedMembers,
  setSelectedMembers,
}: AddMinistryGroupMemberModalProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const educationEnrollmentsApi = new EducationEnrollmentsApi(false);

  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

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
    const response = await educationEnrollmentsApi.getNotEnrolledMembers({
      churchId,
      educationId: targetEducationTerm.educationId,
      educationTermId: targetEducationTerm.id,
      page,
      take: 50,
      name: name.length > 0 ? name : undefined,
    });
    return response.data.data;
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
      <AddEnrollmentMemberModalView
        searchName={searchName}
        searchedMembers={members}
        selectedMembers={selectedMembers}
        onChangeSearch={onChangeSearch}
        onClickMember={onClickMember}
        scrollRef={scrollRef}
        onScroll={onScroll}
      />
    </>
  );
};

export default AddEnrollmentMemberModal;
