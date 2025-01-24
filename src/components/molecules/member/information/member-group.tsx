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
  const fetchData = () => {
    groupHistoryApi
      .getGroupHistory({
        churchId,
        memberId: targetMember.id,
        orderDirection: ORDER_DIRECTION.DESC,
      })
      .then((response) => {
        const newGroupHistory = response.data.data;
        setGroupHistory(newGroupHistory);
      });
  };

  // 교인의 그룹 이력 불러오기
  useEffect(() => {
    fetchData();
  }, [targetMember.id]);

  // 기존 그룹 수정하기
  const onClickSaveGroupHistory = (startDate?: string, endDate?: string) => {
    groupHistoryApi
      .editGroupHistory(
        {
          churchId,
          memberId: targetMember.id,
          groupHistoryId: targetGroupHistory.id,
        },
        { startDate, endDate }
      )
      .then(() => {
        setIsModalShown(false);
        fetchData();
        setTargetGroupHistory(DEFAULT_GROUP_HISTORY);
      });
  };

  // 기존 그룹 삭제하기
  const onClickDeleteGroup = (groupId: string) => {
    groupHistoryApi
      .deleteGroupHistory({
        churchId,
        memberId: targetMember.id,
        groupHistoryId: groupId,
      })
      .then(() => {
        fetchData();
      });
  };

  const props = {
    groupHistory,
    targetGroupHistory,
    isModalShown,
    onClickCloseModal,
    onClickEditGroup,
    onClickSaveGroupHistory,
    onClickDeleteGroup,
  };

  return (
    <>
      <MemberGroupView {...props} />
    </>
  );
};

export default MemberGroup;
