import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { MembersApi } from '../../../../../api/members/members.api';
import { BLANK } from '@mokjang/constants';
import { FamilyMember, Member } from '@mokjang/models';
import { getFormattedName } from '@mokjang/utils';
import { MEMBER } from '@mokjang/constants';
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
