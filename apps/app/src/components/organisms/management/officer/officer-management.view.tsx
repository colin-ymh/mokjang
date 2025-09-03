import React from 'react';
import styled from 'styled-components';
import { Officer } from '@mokjang/models';
import OfficerSideBar from '../../../molecules/management/officer/list/officer-side-bar';
import OfficerInformation from '../../../molecules/management/officer/informaton/officer-information';

const OfficerManagementContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

type OfficerManagementViewProps = {
  selectedOfficer: Officer;
  onClickOfficer: (officer: Officer) => void;
};

const OfficerManagementView = ({
  selectedOfficer,
  onClickOfficer,
}: OfficerManagementViewProps) => {
  return (
    <>
      <OfficerManagementContainer>
        {/* 그룹 목록 */}
        <OfficerSideBar
          selectedOfficer={selectedOfficer}
          onClickOfficer={onClickOfficer}
        />
        {/* 그룹원 목록 */}
        <OfficerInformation
          selectedOfficer={selectedOfficer}
          onClickOfficer={onClickOfficer}
        />
      </OfficerManagementContainer>
    </>
  );
};

export default OfficerManagementView;
