import React from 'react';
import styled from 'styled-components';

import { WHITE } from '@/constants/styles/color';
import EditList from '@/components/molecules/edit/edit-list';
import { MEMBER } from '@/constants/member/member-column';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${WHITE};
  width: 100%;
  overflow-y: scroll;
`;

type MemberEditProps = {
  focusItem: MEMBER;
};

const MemberEdit = ({ focusItem }: MemberEditProps) => {
  const props = {
    focusItem,
  };
  return (
    <RegisterContainer>
      <EditList {...props} />
    </RegisterContainer>
  );
};

export default MemberEdit;
