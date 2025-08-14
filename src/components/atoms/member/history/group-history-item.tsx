import { GroupDetailHistory, GroupHistory } from '@/models/member/history';
import React, { useState } from 'react';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GroupHistoryItemView from '@/components/atoms/member/history/group-history-item.view';

type GroupHistoryItemProps = {
  history: GroupHistory;
};

const GroupHistoryItem = ({ history }: GroupHistoryItemProps) => {
  const groupHistoryApi = new GroupHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [details, setDetails] = useState<GroupDetailHistory[] | undefined>(
    undefined
  );

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const onClickDetail = async () => {
    if (isOpened) {
      setIsOpened(false);
      return;
    }

    try {
      setIsOpened(true);

      if (!details) {
        const response = await groupHistoryApi.getGroupDetailHistory({
          churchId,
          memberId: targetMember.id,
          groupHistoryId: history.id,
        });

        const newDetails = response.data.data;

        setDetails(newDetails);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const props = {
    history,
    isOpened,
    onClickDetail,
    details,
  };

  return (
    <>
      <GroupHistoryItemView {...props} />
    </>
  );
};

export default GroupHistoryItem;
