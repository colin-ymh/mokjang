import { useEffect, useState } from 'react';

import { MinistryGroup } from '@/models/management/management';
import { Member } from '@/models/member/member';
import { MembersApi } from '@/api/churches/members.api';
import MinistryGroupMemberView from '@/components/molecules/management/ministry/ministry-group-member.view';
import { MEMBER } from '@/constants/member/member-column';

type MinistryGroupMemberProps = {
  ministryGroup: MinistryGroup;
};

const MinistryGroupMember = ({ ministryGroup }: MinistryGroupMemberProps) => {
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
    if (ministryGroup.ministries?.length !== 0) {
      membersApi
        .getMembers({
          churchId: ministryGroup.churchId,
          ministries: ministryGroup.ministries?.map((ministry) => {
            return ministry.id;
          }),
          selectedColumns: [
            MEMBER.GROUP,
            MEMBER.BIRTH,
            MEMBER.OFFICER,
            MEMBER.MOBILE_PHONE,
          ],
        })
        .then((response) => {
          setMembers(response.data.data);
        });
    } else {
      setMembers([]);
    }
  };

  // 교인 불러오기
  useEffect(() => {
    fetchMembers();
  }, [ministryGroup]);

  const props = {
    ministryGroup,
    members,
    isModalShown,
    fetchMembers,
    onClickModalOpen,
    onClickModalClose,
  };

  return (
    <>
      <MinistryGroupMemberView {...props} />
    </>
  );
};

export default MinistryGroupMember;
