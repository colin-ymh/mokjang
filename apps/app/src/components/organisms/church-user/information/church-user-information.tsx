import React, { useState } from 'react';

import { CHURCH_USER_HEADER_ID } from '../../../../constants/layout/header';
import ChurchUserInformationView from './church-user-information.view';

type ChurchUserInformationProps = { isManager: boolean };

const ChurchUserInformation = ({ isManager }: ChurchUserInformationProps) => {
  const [headerBarValue, setHeaderBarValue] = useState<CHURCH_USER_HEADER_ID>(
    CHURCH_USER_HEADER_ID.ACCOUNT
  );

  const onChangeHeader = (value: CHURCH_USER_HEADER_ID) => {
    setHeaderBarValue(value);
  };

  const props = {
    isManager,
    headerBarValue,
    onChangeHeader,
  };

  return (
    <>
      <ChurchUserInformationView {...props} />
    </>
  );
};

export default ChurchUserInformation;
