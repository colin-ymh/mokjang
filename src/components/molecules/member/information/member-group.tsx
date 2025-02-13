import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import MemberGroupView from '@/components/molecules/member/information/member-group.view';
import { DEFAULT_GROUP_HISTORY, GroupHistory } from '@/models/member/history';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import { ORDER_DIRECTION } from '@/constants/constant';
import { Member } from '@/models/member/member';

type MemberGroupProps = {
  targetMember: Member;
};

const MemberGroup = ({ targetMember }: MemberGroupProps) => {
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const groupHistoryApi = new GroupHistoryApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 사용자의 그룹 이력
  const [groupHistory, setGroupHistory] = useState<GroupHistory[]>([]);

  // 그룹 추가 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 수정하려는 그룹
  const [targetGroupHistory, setTargetGroupHistory] = useState<GroupHistory>(
    DEFAULT_GROUP_HISTORY
  );

  // 모달 닫기
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setTargetGroupHistory(DEFAULT_GROUP_HISTORY);
  };

  // 그룹 선택 시
  const onClickEditGroup = (group: GroupHistory) => {
    setTargetGroupHistory(group);
    setIsModalShown(true);
  };

  // 서버에서 데이터 로드
  const fetchData = async () => {
    try {
      const response = await groupHistoryApi.getGroupHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      });

      const newGroupHistory = response.data.data;
      setGroupHistory(newGroupHistory);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 교인의 그룹 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 기존 그룹 수정하기
  const onClickSaveGroupHistory = async (
    startDate?: string,
    endDate?: string
  ) => {
    try {
      await groupHistoryApi.editGroupHistory(
        {
          churchId,
          memberId: targetMember.id,
          groupHistoryId: targetGroupHistory.id,
        },
        { startDate, endDate }
      );

      setIsModalShown(false);
      fetchData();
      setTargetGroupHistory(DEFAULT_GROUP_HISTORY);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 기존 그룹 삭제하기
  const onClickConfirmDelete = async (groupId: string) => {
    try {
      await groupHistoryApi.deleteGroupHistory({
        churchId,
        memberId: targetMember.id,
        groupHistoryId: groupId,
      });

      fetchData();
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    groupHistory,
    targetGroupHistory,
    isModalShown,
    onClickCloseModal,
    onClickEditGroup,
    onClickSaveGroupHistory,
    onClickConfirmDelete,
  };

  return (
    <>
      <MemberGroupView {...props} />
    </>
  );
};

export default MemberGroup;
