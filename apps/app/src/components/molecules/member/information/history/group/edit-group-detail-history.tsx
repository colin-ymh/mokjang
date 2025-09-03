import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { setTargetGroupDetailHistory } from '../../../../../../redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '../../../../../../utils/date';
import EditGroupDetailHistoryView from './edit-group-detail-history.view';

type EditGroupDetailHistoryProps = {
  onClickDeleteGroup: () => void;
};

const EditGroupDetailHistory = ({
  onClickDeleteGroup,
}: EditGroupDetailHistoryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetGroupDetailHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetGroupDetailHistory({
          ...targetGroupDetailHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetGroupDetailHistory({
          ...targetGroupDetailHistory,
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
      <EditGroupDetailHistoryView {...props} />
    </>
  );
};

export default EditGroupDetailHistory;
