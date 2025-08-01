import React, { useState } from 'react';
import EducationInformationView from '@/components/organisms/education/education/information/education-information.view';

type EducationInformationProps = {};

const EducationInformation = ({}: EducationInformationProps) => {
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const props = {};

  return (
    <>
      <EducationInformationView {...props} />
    </>
  );
};

export default EducationInformation;
