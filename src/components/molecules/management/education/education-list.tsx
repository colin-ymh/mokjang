import { Dispatch, SetStateAction } from 'react';

import { Education } from '@/models/management/management';
import EducationListView from '@/components/molecules/management/education/education-list.view';

type EducationListProps = {
  educations: Education[];
  fetchEducations: () => void;
  selectedEducationId: string | null;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
};

const EducationList = ({
  educations,
  fetchEducations,
  selectedEducationId,
  setSelectedEducation,
}: EducationListProps) => {
  const props = {
    educations,
    selectedEducationId,
    setSelectedEducation,
    fetchEducations,
  };
  return (
    <>
      <EducationListView {...props} />
    </>
  );
};

export default EducationList;
