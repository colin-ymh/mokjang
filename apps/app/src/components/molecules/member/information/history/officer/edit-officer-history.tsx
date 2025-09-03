import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { setTargetOfficerHistory } from '../../../../../../redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '../../../../../../utils/date';
import EditOfficerHistoryView from './edit-officer-history.view';

type EditMemberOfficerProps = {
  onClickDeleteOfficer: () => void;
};

const EditOfficerHistory = ({
  onClickDeleteOfficer,
}: EditMemberOfficerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetOfficerHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetOfficerHistory({
          ...targetOfficerHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetOfficerHistory({
          ...targetOfficerHistory,
          endDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const props = {
    onChangeStartDate,
    onChangeEndDate,
    onClickDeleteOfficer,
  };

  return (
    <>
      <EditOfficerHistoryView {...props} />
    </>
  );
};

export default EditOfficerHistory;
