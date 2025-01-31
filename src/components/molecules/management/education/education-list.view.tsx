import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Education } from '@/models/management/management';
import ManagementEducationItem from '@/components/atoms/management/education/management-education-item';

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
`;

type EducationListViewProps = {
  educations: Education[];
  selectedEducationId: string | null;
  setSelectedEducation: Dispatch<SetStateAction<Education>>;
  fetchEducations: () => void;
};

const EducationListView = ({
  educations,
  selectedEducationId,
  setSelectedEducation,
  fetchEducations,
}: EducationListViewProps) => {
  return (
    <FilterContainer>
      {educations?.map((education) => (
        <ManagementEducationItem
          key={education.id}
          education={education}
          selectedEducationId={selectedEducationId}
          setSelectedEducation={setSelectedEducation}
          fetchEducations={fetchEducations}
        />
      ))}
    </FilterContainer>
  );
};

export default EducationListView;
