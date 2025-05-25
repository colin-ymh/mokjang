import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import React, { useState } from 'react';
import { setVisitations } from '@/redux/reducers/filter/visitation-filter-reducer';
import VisitationInformationView from '@/components/organisms/visitation/information/visitation-information.view';
import { VISITATION_STATUS } from '@/constants/status/status';

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
          { status }
        )
        .then((response) => {
          const newVisitation = response.data;

          dispatch(
            setTargetVisitation({
              ...targetVisitation,
              status,
            })
          );

          const newVisitations = visitations.map((v) => {
            return v.id !== newVisitation.id ? v : { ...v, status };
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
