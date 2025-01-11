import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GroupHistoryApi } from '@/api/history/group-history';
import { MembersApi } from '@/api/churches/members.api';
import AddGroupMemberModalView from '@/components/atoms/modal/add-group-member-modal.view';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Group } from '@/models/management/management';
import { getFormattedName } from '@/utils/format';

type AddGroupMemberModalProps = {
  group: Group;
  isShown: boolean;
  onClickClose: () => void;
};

const AddGroupMemberModal = ({
  group,
  isShown,
  onClickClose,
}: AddGroupMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const groupHistoryApi = new GroupHistoryApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 검색하고자 하는 교인 이름
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

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
      (member) => member.id === targetMember.id
    );

    // 이미 존재한다면 제거, 없으면 추가
    const newSelectedMembers = isMemberSelected
      ? selectedMembers.filter((member) => member.id !== targetMember.id)
      : [...selectedMembers, targetMember];

    setSelectedMembers(newSelectedMembers);
  };

  // 추가 버튼 이벤트
  const onClickSave = () => {
    if (selectedMembers.length !== 0) {
      selectedMembers.map((member) => {
        groupHistoryApi.createGroupHistory(
          { churchId, memberId: member.id },
          {
            groupId: group.id as string,
            startDate: new Date().toDateString(),
            autoEndDate: true,
          }
        );
      });
      // 모달 닫기
      onClickClose();
      resetData();
    }
  };

  // 검색 내용이 변경되면, 검색된 교인 목록 변경
  useEffect(() => {
    membersApi
      .getMembers({ churchId, page: 1, take: 1000, name: searchName })
      .then((response) => {
        const newMembers = response.data.data;
        setSearchedMembers(newMembers);
      });
  }, [searchName, isShown]);

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
    group,
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
