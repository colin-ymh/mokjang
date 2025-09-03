import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { setTargetGroupHistory } from '../../../../../../redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '@mokjang/utils';
import EditGroupHistoryView from './edit-group-history.view';

type EditMemberGroupProps = {
  onClickDeleteGroup: () => void;
};

const EditGroupHistory = ({ onClickDeleteGroup }: EditMemberGroupProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetGroupHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

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

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetGroupHistory({
          ...targetGroupHistory,
          endDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const props = {
    onChangeStartDate,
    onChangeEndDate,
    onClickDeleteGroup,
  };

  return (
    <>
      <EditGroupHistoryView {...props} />
    </>
  );
};

export default EditGroupHistory;
