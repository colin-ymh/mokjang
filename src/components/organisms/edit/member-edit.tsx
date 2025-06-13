import React from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import EditList, { EditListProps } from '@/components/molecules/edit/edit-list';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${WHITE};
  width: 100%;
  overflow-y: scroll;
`;

const MemberEdit = (props: EditListProps) => {
  return (
    <RegisterContainer>
      <EditList {...props} />
    </RegisterContainer>
  );
};

export default MemberEdit;
