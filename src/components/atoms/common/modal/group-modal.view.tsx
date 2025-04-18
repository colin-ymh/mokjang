import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';

import { GroupHistory } from '@/models/member/history';
import { Group } from '@/models/management/management';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import { MainText } from '@/components/atoms/common/text/main-text';
import SelectGroup from '@/components/molecules/member/information/select-group';

const GroupModalViewContainer = styled.div`
  display: flex;
  height: 100%;
`;

const ModalContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const SelectContainer = styled.div<{ $isShown: boolean }>`
  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
`;

const SelectedGroupContainer = styled.div`
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

const CancelButton = styled(Cancel)`
  stroke: ${WHITE};
  stroke-width: 2px;
  width: 25px;
  height: 25px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

type GroupModalViewProps = {
  targetHistory: GroupHistory | undefined;
  selectedGroup: Group;
  selectedRoleId: string;
  roleItems: DropdownValueType[];
  isButtonEnabled: boolean;
  startDate: string;
  endDate: string;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewGroup?: (
    groupId: string,
    groupRoleId: string,
    startDate: string
  ) => void;
  onClickSaveGroupHistory?: (startDate?: string, endDate?: string) => void;
  onClickCancelGroup?: () => void;
  onChangeRoleId: (id: string) => void;
  onChangeGroup: (group: Group) => void;
  isSelectOpened: boolean;
  onClickOpen: () => void;
  onClickClose: () => void;
};

const GroupModalView = ({
  targetHistory,
  selectedGroup,
  roleItems,
  selectedRoleId,
  isButtonEnabled,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onChangeGroup,
  onChangeRoleId,
  onClickSaveNewGroup,
  onClickSaveGroupHistory,
  onClickCancelGroup,
  isSelectOpened,
  onClickOpen,
  onClickClose,
}: GroupModalViewProps) => {
  const t = useI18n();

  return (
    <GroupModalViewContainer>
      <ModalContainer $isShown={!isSelectOpened}>
        {/* 내용 */}
        <ContentContainer>
          {!targetHistory?.endDate && (
            <GroupContainer>
              {/* 그룹 */}
              <SelectedGroupContainer>
                <MainText>{t('group')}</MainText>
                {/* 현재 상태값 & 버튼 */}
                <GroupButton onClick={onClickOpen}>
                  <MainText>{selectedGroup.name}</MainText>
                </GroupButton>
              </SelectedGroupContainer>
              <Button width={42} height={42} onClick={onClickCancelGroup}>
                <CancelButton />
              </Button>
            </GroupContainer>
          )}

          {/* 역할 */}
          {roleItems.length > 0 &&
            selectedGroup.id &&
            !targetHistory?.endDate && (
              <LabelDropdown
                label={t('groupRole')}
                value={selectedRoleId}
                items={roleItems}
                onChangeItem={onChangeRoleId}
              />
            )}
          {/* 시작 날짜 */}
          <LabelInput
            label={t('startDate')}
            value={startDate}
            onChange={onChangeStartDate}
            placeholder={t('placeholder.startDate')}
          />
          {/* 종료 날짜 */}
          {targetHistory?.endDate && (
            <LabelInput
              label={t('endDate')}
              value={endDate}
              onChange={onChangeEndDate}
              placeholder={t('placeholder.endDate')}
            />
          )}
        </ContentContainer>
        {/* 버튼 */}
        <ButtonContainer>
          <Button
            text={t('button.save')}
            disabled={!isButtonEnabled}
            backgroundColor={isButtonEnabled ? MAIN.DEFAULT : GRAY.LIGHT}
            height={30}
            onClick={() => {
              if (targetHistory?.endDate) {
                onClickSaveGroupHistory &&
                  onClickSaveGroupHistory(startDate, endDate);
              } else {
                onClickSaveNewGroup &&
                  onClickSaveNewGroup(
                    selectedGroup.id as string,
                    selectedRoleId,
                    startDate
                  );
              }
            }}
          />
        </ButtonContainer>
      </ModalContainer>
      {/* 그룹 선택 모달 */}
      <SelectContainer $isShown={isSelectOpened}>
        <SelectGroup
          value={selectedGroup.id}
          onClickSave={onChangeGroup}
          onClickClose={onClickClose}
        />
      </SelectContainer>
    </GroupModalViewContainer>
  );
};

export default GroupModalView;
