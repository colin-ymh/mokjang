import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GroupHistoryApi } from '@/api/history/group-history.api';
import { MembersApi } from '@/api/members/members.api';
import AddGroupMemberModalView from '@/components/atoms/management/group/member/add-group-member-modal.view';
import { BLANK } from '@/constants/constant';
import { Member } from '@/models/member/member';
import { Group } from '@/models/management/management';
import { getFormattedName } from '@/utils/format';

type AddGroupMemberModalProps = {
  group: Group;
  isShown: boolean;
  fetchMembers: () => void;
  onClickClose: () => void;
  setIsToastShown: Dispatch<SetStateAction<boolean>>;
};

const AddGroupMemberModal = ({
  group,
  isShown,
  fetchMembers,
  onClickClose,
  setIsToastShown,
}: AddGroupMemberModalProps) => {
  const membersApi = new MembersApi(false);
  const groupHistoryApi = new GroupHistoryApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // ===============================
  // 상태값 관리
  // ===============================
  // 검색어
  const [searchName, setSearchName] = useState<string>(BLANK);

  // 검색된 교인 목록
  const [searchedMembers, setSearchedMembers] = useState<Member[]>([]);

  // 선택된 교인 목록
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // ===============================
  // 유틸 함수
  // ===============================
  // 데이터 리셋
  const resetData = () => {
    setSearchName(BLANK);
    setSelectedMembers([]);
  };

  // 교인 목록 검색
  const fetchSearchedMembers = async (name: string) => {
    const response = await membersApi.getMembers({
      churchId,
      page: 1,
      take: 1000,
      name,
    });
    setSearchedMembers(response.data.data);
  };

  // 선택된 교인을 목표 그룹에 추가
  // 이미 다른 그룹에 속해 있으면 stop 후 create
  // 이미 동일 그룹이면 건너뜀(중복 추가 방지)
  const addMembersToGroup = async (membersToAdd: Member[]) => {
    for (const mem of membersToAdd) {
      // 이미 같은 그룹이면 스킵
      if (mem.group?.id === group.id) {
        continue;
      }

      // 이미 다른 그룹에 속해 있다면 이력 중단
      if (mem.group?.id && mem.group.id !== group.id) {
        await groupHistoryApi.stopGroupHistory(
          { churchId, memberId: mem.id },
          {}
        );
      }

      // 새 그룹에 이력 생성
      await groupHistoryApi.createGroupHistory(
        { churchId, memberId: mem.id },
        {
          groupId: group.id as string,
        }
      );
    }
  };

  // ===============================
  // 이벤트 핸들러
  // ===============================
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

  // "추가" 버튼 클릭 시
  const onClickSave = async () => {
    try {
      if (selectedMembers.length === 0) return;

      // 이미 그룹에 속한 교인이면 stop 후 create
      // 중복 그룹이면 스킵
      await addMembersToGroup(selectedMembers);

      // 목록 갱신 후 모달 닫기
      fetchMembers();
      onClickClose();
      resetData();
    } finally {
      setIsToastShown(true);
    }
  };

  // ===============================
  // useEffect
  // ===============================
  // 검색어/모달 열림 상태가 바뀌면 교인 목록 다시 가져오기
  useEffect(() => {
    if (isShown) {
      fetchSearchedMembers(searchName);
    }
  }, [searchName, isShown]);

  // esc 키 입력 시 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickClose();
        resetData();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClickClose]);

  // ===============================
  // 렌더링
  // ===============================
  return (
    <AddGroupMemberModalView
      group={group}
      isShown={isShown}
      searchName={searchName}
      searchedMembers={searchedMembers}
      selectedMembers={selectedMembers}
      resetData={resetData}
      onChangeSearch={onChangeSearch}
      onClickMember={onClickMember}
      onClickClose={onClickClose}
      onClickSave={onClickSave}
    />
  );
};

export default AddGroupMemberModal;
