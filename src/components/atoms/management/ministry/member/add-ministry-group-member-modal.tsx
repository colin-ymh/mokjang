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

import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Ministry, MinistryGroup } from '@/models/management/management';
import { getFormattedName } from '@/utils/format';
import { MEMBER } from '@/constants/column/member-column';
import AddMinistryGroupMemberModalView from '@/components/atoms/management/ministry/member/add-ministry-group-member-modal.view';

type AddMinistryGroupMemberModalProps = {
  ministryGroup: MinistryGroup;
  selectedMinistryId: string;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
  ministries: Ministry[];
  onChangeMinistryItem: (id: string) => void;
};

const AddMinistryGroupMemberModal = ({
  ministryGroup,
  selectedMinistryId,
  selectedMembers,
  setSelectedMembers,
  ministries,
  onChangeMinistryItem,
}: AddMinistryGroupMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 검색어
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 교인 목록 검색
  const fetchSearchedMembers = async (name: string) => {
    const response = await membersApi.getMembers({
      churchId,
      page: 1,
      take: 1000,
      name,
      selectedColumns: [
        MEMBER.OFFICER,
        MEMBER.MOBILE_PHONE,
        MEMBER.BIRTH,
        MEMBER.GROUP,
      ],
    });
    setSearchedMembers(response.data.data);
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

  // 검색어/모달 열림 상태가 바뀌면 교인 목록 다시 가져오기
  useEffect(() => {
    fetchSearchedMembers(searchName);
  }, [searchName]);

  return (
    <>
      <AddMinistryGroupMemberModalView
        ministryGroup={ministryGroup}
        searchName={searchName}
        searchedMembers={searchedMembers}
        selectedMembers={selectedMembers}
        onChangeSearch={onChangeSearch}
        onClickMember={onClickMember}
        ministries={ministries}
        selectedMinistryId={selectedMinistryId}
        onChangeMinistryItem={onChangeMinistryItem}
      />
    </>
  );
};

export default AddMinistryGroupMemberModal;
