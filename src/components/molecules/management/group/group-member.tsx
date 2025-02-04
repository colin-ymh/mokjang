import GroupMemberView from '@/components/molecules/management/group/group-member.view';
import { Group } from '@/models/management/management';
import { Member } from '@/models/member/member';
import { useEffect, useState } from 'react';

import { MembersApi } from '@/api/members/members.api';
import { MEMBER } from '@/constants/member/member-column';

type GroupMemberProps = {
  group: Group;
};

const GroupMember = ({ group }: GroupMemberProps) => {
  const membersApi = new MembersApi(false);

  // 그룹에 속한 교인 목록
  const [members, setMembers] = useState<Member[]>([]);

  // 그룹에 교인 다중 추가를 위한 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 교인 추가 모달 열기
  const onClickModalOpen = () => {
    setIsModalShown(true);
  };

  // 교인 추가 모달 닫기
  const onClickModalClose = () => {
    setIsModalShown(false);
  };

  const fetchMembers = () => {
    membersApi
      .getMembers({
        churchId: group.churchId,
        group: [group.id as string],
        selectedColumns: [MEMBER.OFFICER, MEMBER.BIRTH, MEMBER.MOBILE_PHONE],
      })
      .then((response) => {
        setMembers(response.data.data);
      });
  };

  // 교인 불러오기
  useEffect(() => {
    fetchMembers();
  }, [group]);

  const props = {
    group,
    members,
    isModalShown,
    fetchMembers,
    onClickModalOpen,
    onClickModalClose,
  };

  return (
    <>
      <GroupMemberView {...props} />
    </>
  );
};

export default GroupMember;
