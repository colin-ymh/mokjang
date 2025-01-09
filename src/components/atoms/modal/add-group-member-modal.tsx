import AddGroupMemberModalView from '@/components/atoms/modal/add-group-member-modal.view';
import { MembersApi } from '@/api/churches/members.api';
import { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { getFormattedName } from '@/utils/format';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type AddGroupMemberModalProps = {
  isShown: boolean;
  onClickClose: () => void;
};

const AddGroupMemberModal = ({
  isShown,
  onClickClose,
}: AddGroupMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 검색하고자 하는 교인 이름
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // 데이터 리셋
  const resetData = () => {
    setSearchName(BLANK);
    setSelectedMembers([]);
  };

  // 검색창 이벤트
  const onChangeSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const name = getFormattedName(event.target.value);
    setSearchName(name);
  };

  // 교인 선택
  const onClickMember = (targetMember: Member) => {
    // 이미 존재하는지 확인
    const isMemberSelected = selectedMembers.some(
      (id) => id === targetMember.id
    );

    // 이미 존재한다면 제거, 없으면 추가
    const newSelectedMembers = isMemberSelected
      ? selectedMembers.filter((id) => id !== targetMember.id)
      : [...selectedMembers, targetMember.id];

    setSelectedMembers(newSelectedMembers);
  };

  // 추가 버튼 이벤트
  const onClickSave = () => {};

  // 검색 내용이 변경되면, 검색된 교인 목록 변경
  useEffect(() => {
    membersApi
      .getMembers({ churchId, page: 1, take: 1000, name: searchName })
      .then((response) => {
        const newMembers = response.data.data;
        setSearchedMembers(newMembers);
      });
  }, [searchName]);

  // esc
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickClose();
        resetData();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClickClose]);

  const props = {
    isShown,
    searchName,
    searchedMembers,
    selectedMembers,
    resetData,
    onChangeSearch,
    onClickMember,
    onClickClose,
    onClickSave,
  };
  return (
    <>
      <AddGroupMemberModalView {...props} />
    </>
  );
};

export default AddGroupMemberModal;
