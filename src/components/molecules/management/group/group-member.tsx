import GroupMemberView from '@/components/molecules/management/group/group-member.view';
import { Group } from '@/models/management/management';
import { Member } from '@/models/member/member';
import { useEffect, useState } from 'react';

import { MembersApi } from '@/api/members/members.api';
import { MEMBER } from '@/constants/member/member-column';
import { useScopedI18n } from '../../../../../locales/client';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

type GroupMemberProps = {
  group: Group;
};

const GroupMember = ({ group }: GroupMemberProps) => {
  const membersApi = new MembersApi(false);
  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isToastShown, setIsToastShown] = useState<boolean>(false);

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
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const response = await membersApi.getMembers({
        churchId: group.churchId,
        group: [group.id as string],
        selectedColumns: [MEMBER.OFFICER, MEMBER.BIRTH, MEMBER.MOBILE_PHONE],
        page,
        take: 30,
      });

      const newMembers: Member[] = response.data.data;

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

  // 무한 스크롤로 데이터 추가 로드
  const loadMembers = () => {
    setPage(page + 1);
  };

  // 교인 불러오기
  useEffect(() => {
    fetchMembers();
  }, [page]);

  useEffect(() => {
    setMembers([]);
    setPage(1);
    fetchMembers();
  }, [group.id]);

  const props = {
    group,
    members,
    isModalShown,
    fetchMembers,
    onClickModalOpen,
    onClickModalClose,
    setIsToastShown,
    loadMembers,
  };

  return (
    <>
      <GroupMemberView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </>
  );
};

export default GroupMember;
