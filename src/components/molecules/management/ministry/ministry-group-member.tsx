import { useEffect, useState } from 'react';

import { MinistryGroup } from '@/models/management/management';
import { Member } from '@/models/member/member';
import { MembersApi } from '@/api/members/members.api';
import MinistryGroupMemberView from '@/components/molecules/management/ministry/ministry-group-member.view';
import { MEMBER } from '@/constants/member/member-column';

type MinistryGroupMemberProps = {
  ministryGroup: MinistryGroup;
};

const MinistryGroupMember = ({ ministryGroup }: MinistryGroupMemberProps) => {
  const membersApi = new MembersApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

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

  const fetchMembers = async () => {
    try {
      if (ministryGroup.ministries?.length !== 0) {
        const response = await membersApi.getMembers({
          churchId: ministryGroup.churchId,
          ministries: ministryGroup.ministries?.map((ministry) => ministry.id),
          selectedColumns: [
            MEMBER.GROUP,
            MEMBER.BIRTH,
            MEMBER.OFFICER,
            MEMBER.MOBILE_PHONE,
          ],
        });
        setMembers(response.data.data);
      } else {
        setMembers([]);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
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
