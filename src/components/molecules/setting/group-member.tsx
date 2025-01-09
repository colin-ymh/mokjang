import GroupMemberView from '@/components/molecules/setting/group-member.view';
import { Group } from '@/models/setting/group';
import { Member } from '@/models/member/member';
import { useEffect, useState } from 'react';
import { MembersApi } from '@/api/churches/members.api';

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

  // 교인 불러오기
  useEffect(() => {
    membersApi
      .getMembers({
        churchId: group.churchId,
        group: [group.id as string],
      })
      .then((response) => {
        console.log(response);
      });
  }, [group]);

  const props = {
    group,
    members,
    isModalShown,
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
