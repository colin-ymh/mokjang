import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { setTargetOfficerHistory } from '../../../../../redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '../../../../../utils/date';
import EditMemberOfficerView from './edit-member-officer.view';
import { Officer } from '../../../../../models/management/management';

type EditMemberOfficerProps = {
  onClickDeleteOfficer: () => void;
};

const EditMemberOfficer = ({
  onClickDeleteOfficer,
}: EditMemberOfficerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { targetOfficerHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );
  const { officers } = useSelector((state: RootState) => state.church);

  const onChangeOfficer = (officerId: string | null) => {
    if (!officerId) return;

    const newOfficer = officers.find(
      (officer) => officer.id === officerId
    ) as Officer;

    dispatch(
      setTargetOfficerHistory({
        ...targetOfficerHistory,
        officer: {
          id: officerId,
          name: newOfficer.name,
          order: 0,
        },
        officerSnapShot: newOfficer.name,
      })
    );
  };

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

  const props = {
    onClickDeleteOfficer,
    onChangeOfficer,
    onChangeStartDate,
  };

  return (
    <>
      <EditMemberOfficerView {...props} />
    </>
  );
};

export default EditMemberOfficer;
