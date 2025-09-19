import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../../redux/store';
import { setTargetMinistryDetailHistory } from '../../../../../../redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '@mokjang/utils';
import EditMinistryDetailHistoryView from './edit-ministry-detail-history.view';

type EditMinistryDetailHistoryProps = {
  onClickDeleteMinistry: () => void;
};

const EditMinistryDetailHistory = ({
  onClickDeleteMinistry,
}: EditMinistryDetailHistoryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetMinistryDetailHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMinistryDetailHistory({
          ...targetMinistryDetailHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMinistryDetailHistory({
          ...targetMinistryDetailHistory,
          endDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const props = {
    onChangeStartDate,
    onChangeEndDate,
    onClickDeleteMinistry,
  };

  return (
    <>
      <EditMinistryDetailHistoryView {...props} />
    </>
  );
};

export default EditMinistryDetailHistory;
