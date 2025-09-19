import React from 'react';
import VisitationInformationView from './visitation-information.view';
import { TASK_STATUS } from '@mokjang/constants';

type VisitationInformationProps = {
  onChangeStatus?: (status: TASK_STATUS) => void;
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
