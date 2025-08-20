import React from 'react';
import VisitationInformationView from '@/components/organisms/visitation/information/visitation-information.view';
import { TASK_STATUS } from '@/constants/status/status';

type VisitationInformationProps = {
  onChangeStatus: (status: TASK_STATUS) => void;
};

const VisitationInformation = ({
  onChangeStatus,
}: VisitationInformationProps) => {
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
