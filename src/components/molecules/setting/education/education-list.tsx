import { Dispatch, SetStateAction } from 'react';

import { Education } from '@/models/setting/setting';
import EducationListView from '@/components/molecules/setting/education/education-list.view';

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
