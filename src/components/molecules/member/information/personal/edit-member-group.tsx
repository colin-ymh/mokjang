import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetGroupHistory } from '@/redux/reducers/target/target-history-reducer';
import { getGroup } from '@/utils/group';
import { getDateStringFromDate } from '@/utils/date';
import EditMemberGroupView from '@/components/molecules/member/information/personal/edit-member-group.view';

type EditMemberGroupProps = {
  onClickDeleteGroup: () => void;
};

const EditMemberGroup = ({ onClickDeleteGroup }: EditMemberGroupProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetGroupHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );
  const { groups } = useSelector((state: RootState) => state.church);

  const [isGroupOpen, setIsGroupOpen] = useState<boolean>(false);

  const onClickGroupOpen = () => setIsGroupOpen(true);
  const onClickGroupClose = () => setIsGroupOpen(false);

  const onChangeGroup = (groupId: string | null) => {
    if (!groupId) return;

    const newGroup = getGroup(groupId, groups);

    dispatch(
      setTargetGroupHistory({
        ...targetGroupHistory,
        groupId,
        groupSnapShot: newGroup.name,
      })
    );
  };

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetGroupHistory({
          ...targetGroupHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const props = {
    isGroupOpen,
    onClickGroupOpen,
    onClickGroupClose,
    onClickDeleteGroup,
    onChangeGroup,
    onChangeStartDate,
  };

  return (
    <>
      <EditMemberGroupView {...props} />
    </>
  );
};

export default EditMemberGroup;
