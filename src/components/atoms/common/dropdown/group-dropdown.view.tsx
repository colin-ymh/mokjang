import React from 'react';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import SelectGroupModal from '@/components/atoms/common/modal/select-group-modal';
import { Group } from '@/models/management/management';
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

const GroupButton = styled.div`
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

type GroupModalProps = {
  value: string;
  currentGroup: Group;
  groups: Group[];
  parentGroups: Group[];
  selectedGroup: Group;
  isDropdownShown: boolean;
  onClickOpenDropdown: () => void;
  onClickCloseDropdown: () => void;
  onClickParent: (group: Group) => void;
  onClickSaveGroup: (group: Group) => void;
  onClickGoBack: () => void;
};

const GroupDropdownView = ({
  value,
  currentGroup,
  groups,
  parentGroups,
  selectedGroup,
  isDropdownShown,
  onClickOpenDropdown,
  onClickCloseDropdown,
  onClickParent,
  onClickSaveGroup,
  onClickGoBack,
}: GroupModalProps) => {
  const t = useI18n();

  return (
    <LabelInputContainer>
      <MainText>{t('group')}</MainText>
      {/* 현재 상태값 & 버튼 */}
      <GroupButton onClick={() => onClickOpenDropdown()}>
        <MainText>{selectedGroup.name}</MainText>
      </GroupButton>

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
          <SelectGroupModal
            currentGroup={currentGroup}
            groups={groups}
            selectedGroup={selectedGroup}
            parentGroups={parentGroups}
            onClickParent={onClickParent}
            onClickSaveGroup={onClickSaveGroup}
            onClickCloseDropdown={onClickCloseDropdown}
            onClickGoBack={onClickGoBack}
          />
        </CustomPopup>
      </DropdownContainer>
    </LabelInputContainer>
  );
};

export default GroupDropdownView;
