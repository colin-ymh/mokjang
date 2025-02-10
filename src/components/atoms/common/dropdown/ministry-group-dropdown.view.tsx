import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import SelectMinistryGroupModal from '@/components/atoms/common/modal/select-ministry-group-modal';
import { MinistryGroup } from '@/models/management/management';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';

import { useI18n } from '../../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

const LabelInputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  position: relative;
`;

const MinistryGroupButton = styled.div`
  display: flex;
  cursor: pointer;
  padding-left: 10px;
  height: 40px;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  border: 1px solid ${GRAY.DEFAULT};
`;

const DropdownContainer = styled.div`
  display: flex;
  position: absolute;
  left: -0px;
  top: -0px;
`;

type MinistryGroupModalProps = {
  value: string;
  currentMinistryGroup: MinistryGroup;
  ministryGroups: MinistryGroup[];
  parentMinistryGroups: MinistryGroup[];
  selectedMinistryGroup: MinistryGroup;
  isDropdownShown: boolean;
  onClickOpenDropdown: () => void;
  onClickCloseDropdown: () => void;
  onClickParent: (ministryGroup: MinistryGroup) => void;
  onClickSaveMinistryGroup: (ministryGroup: MinistryGroup) => void;
  onClickGoBack: () => void;
};

const MinistryGroupDropdownView = ({
  value,
  currentMinistryGroup,
  ministryGroups,
  parentMinistryGroups,
  selectedMinistryGroup,
  isDropdownShown,
  onClickOpenDropdown,
  onClickCloseDropdown,
  onClickParent,
  onClickSaveMinistryGroup,
  onClickGoBack,
}: MinistryGroupModalProps) => {
  const t = useI18n();
  return (
    <LabelInputContainer>
      <MainText>{t('group')}</MainText>
      {/* 현재 상태값 & 버튼 */}
      <MinistryGroupButton onClick={() => onClickOpenDropdown()}>
        <MainText>{selectedMinistryGroup.name}</MainText>
      </MinistryGroupButton>

      {/* 드롭다운 */}
      <DropdownContainer>
        <TransparentBackground
          isOpened={isDropdownShown}
          onClick={onClickCloseDropdown}
          zIndex={300}
        />
        <CustomPopup
          isShow={isDropdownShown}
          onClickClose={onClickCloseDropdown}
          width={400}
          height={600}
        >
          <SelectMinistryGroupModal
            currentMinistryGroup={currentMinistryGroup}
            ministryGroups={ministryGroups}
            selectedMinistryGroup={selectedMinistryGroup}
            parentMinistryGroups={parentMinistryGroups}
            onClickParent={onClickParent}
            onClickSaveMinistryGroup={onClickSaveMinistryGroup}
            onClickCloseDropdown={onClickCloseDropdown}
            onClickGoBack={onClickGoBack}
          />
        </CustomPopup>
      </DropdownContainer>
    </LabelInputContainer>
  );
};

export default MinistryGroupDropdownView;
