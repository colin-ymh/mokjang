import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { VISITATION_STATUS } from '@/models/visitation/visitation';
import { setTargetVisitation } from '@/redux/reducers/target-visitation-reducer';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import React, { useState } from 'react';
import { setVisitations } from '@/redux/reducers/visitation-filter-reducer';
import VisitationInformationView from '@/components/organisms/visitation/information/visitation-information.view';

type VisitationInformationProps = {};

const VisitationInformation = ({}: VisitationInformationProps) => {
  const { visitations } = useSelector(
    (state: RootState) => state.visitationFilter
  );
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const dispatch = useDispatch<AppDispatch>();
  const visitationsApi = new VisitationsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // ===== status =====

  const onChangeStatus = (status: VISITATION_STATUS) => {
    try {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { visitationStatus: status }
        )
        .then((response) => {
          const newVisitation = response.data;

          dispatch(
            setTargetVisitation({
              ...targetVisitation,
              visitationStatus: status,
            })
          );

          const newVisitations = visitations.map((v) => {
            return v.id !== newVisitation.id
              ? v
              : { ...v, visitationStatus: status };
          });

          dispatch(setVisitations(newVisitations));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  const props = {
    onChangeStatus,
  };
  return (
    <>
      <VisitationInformationView {...props} />
    </>
  );
};

export default VisitationInformation;
