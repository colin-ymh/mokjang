import React from 'react';
import styled from 'styled-components';
import { MinistryGroup } from '@mokjang/models';
import MinistryGroupSideBar from '../../../molecules/management/ministry/list/ministry-group-side-bar';
import MinistryGroupInformation from '../../../molecules/management/ministry/informaton/ministry-group-information';

const MinistryGroupManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

type MinistryGroupManagementViewProps = {
  selectedMinistryGroup: MinistryGroup;
  onClickMinistryGroup: (ministryGroup: MinistryGroup) => void;
};

const MinistryGroupManagementView = ({
  selectedMinistryGroup,
  onClickMinistryGroup,
}: MinistryGroupManagementViewProps) => {
  return (
    <>
      <MinistryGroupManagementContainer>
        {/* 그룹 목록 */}
        <MinistryGroupSideBar
          selectedMinistryGroup={selectedMinistryGroup}
          onClickMinistryGroup={onClickMinistryGroup}
        />
        {/* 그룹원 목록 */}
        <MinistryGroupInformation
          selectedMinistryGroup={selectedMinistryGroup}
          onClickMinistryGroup={onClickMinistryGroup}
        />
      </MinistryGroupManagementContainer>
    </>
  );
};

export default MinistryGroupManagementView;
