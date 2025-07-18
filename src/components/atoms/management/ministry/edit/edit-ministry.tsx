import styled from 'styled-components';
import React from 'react';
import { Ministry } from '@/models/management/management';
import EditMinistryView from '@/components/atoms/management/ministry/edit/edit-ministry.view';

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

type EditMinistryProps = {
  editName: string;
  ministries: Ministry[];
  onChangeEditMinistryName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

const EditMinistry = ({
  editName,
  ministries,
  onChangeEditMinistryName,
}: EditMinistryProps) => {
  const props = {
    editName,
    ministries,
    onChangeEditMinistryName,
  };

  return (
    <>
      <EditMinistryView {...props} />
    </>
  );
};

export default EditMinistry;
