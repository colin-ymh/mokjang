import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetMinistryHistory } from '@/redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '@/utils/date';
import EditMinistryHistoryView from '@/components/molecules/member/information/history/ministry/edit-ministry-history.view';

type EditMemberMinistryProps = {
  onClickDeleteMinistry: () => void;
};

const EditMinistryHistory = ({
  onClickDeleteMinistry,
}: EditMemberMinistryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMinistryHistory({
          ...targetMinistryHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMinistryHistory({
          ...targetMinistryHistory,
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
      <EditMinistryHistoryView {...props} />
    </>
  );
};

export default EditMinistryHistory;
