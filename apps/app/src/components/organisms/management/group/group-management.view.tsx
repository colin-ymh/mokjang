import React from 'react';
import styled from 'styled-components';
import { Group } from '../../../../models/management/management';
import GroupSideBar from '../../../molecules/management/group/list/group-side-bar';
import GroupInformation from '../../../molecules/management/group/informaton/group-information';

const GroupManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

type GroupManagementViewProps = {
  selectedGroup: Group;
  onClickGroup: (group: Group) => void;
};

const GroupManagementView = ({
  selectedGroup,
  onClickGroup,
}: GroupManagementViewProps) => {
  return (
    <>
      <GroupManagementContainer>
        {/* 그룹 목록 */}
        <GroupSideBar
          selectedGroup={selectedGroup}
          onClickGroup={onClickGroup}
        />
        {/* 그룹원 목록 */}
        <GroupInformation
          selectedGroup={selectedGroup}
          onClickGroup={onClickGroup}
        />
      </GroupManagementContainer>
    </>
  );
};

export default GroupManagementView;
