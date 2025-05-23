import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { MinistryGroup } from '@/models/management/management';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { MinistryHistory } from '@/models/member/history';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import { CUSTOM_VALUE } from '@/components/atoms/common/dropdown/dropdown';
import { MainText } from '@/components/atoms/common/text/main-text';
import SelectMinistryGroup from '@/components/molecules/member/information/select-ministry-group';

const MinistryGroupModalViewContainer = styled.div`
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

const MinistryGroupContainer = styled.div`
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

type MinistryGroupModalViewProps = {
  targetHistory: MinistryHistory | undefined;
  selectedMinistryGroup: MinistryGroup;
  selectedMinistryId: string;
  newMinistryName: string;
  ministryItems: DropdownValueType[];
  isButtonEnabled: boolean;
  startDate: string;
  endDate: string;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewMinistry?: (
    ministryGroupId: string,
    ministryId: string,
    startDate: string
  ) => void;
  onClickSaveMinistryGroup?: (startDate?: string, endDate?: string) => void;
  onClickCancelMinistryGroup?: () => void;
  onChangeMinistryId: (id: string) => void;
  onChangeMinistryGroup: (ministry: MinistryGroup) => void;
  onChangeCustomInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickCreateMinistry?: (
    groupId: string,
    startDate: string,
    name: string
  ) => void;
  isSelectOpened: boolean;
  onClickOpen: () => void;
  onClickClose: () => void;
};

const MinistryGroupModalView = ({
  targetHistory,
  selectedMinistryGroup,
  ministryItems,
  newMinistryName,
  selectedMinistryId,
  isButtonEnabled,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onChangeMinistryGroup,
  onChangeMinistryId,
  onClickSaveNewMinistry,
  onClickSaveMinistryGroup,
  onClickCancelMinistryGroup,
  onChangeCustomInput,
  onClickCreateMinistry,
  isSelectOpened,
  onClickOpen,
  onClickClose,
}: MinistryGroupModalViewProps) => {
  const t = useI18n();

  return (
    <MinistryGroupModalViewContainer>
      <ModalContainer $isShown={!isSelectOpened}>
        {/* 내용 */}
        <ContentContainer>
          {!targetHistory?.endDate && (
            <MinistryGroupContainer>
              <SelectedGroupContainer>
                {/* 그룹 */}
                <MainText>{t('group')}</MainText>
                {/* 현재 상태값 & 버튼 */}
                <MinistryGroupButton onClick={() => onClickOpen()}>
                  <MainText>{selectedMinistryGroup.name}</MainText>
                </MinistryGroupButton>
              </SelectedGroupContainer>

              <Button
                width={42}
                height={42}
                onClick={onClickCancelMinistryGroup}
              >
                <CancelButton />
              </Button>
            </MinistryGroupContainer>
          )}
          {/* 역할 */}
          {selectedMinistryGroup.id && !targetHistory?.endDate && (
            <LabelDropdown
              label={t('ministry')}
              value={selectedMinistryId}
              items={ministryItems}
              onChangeItem={onChangeMinistryId}
              isEditable={selectedMinistryId === 'custom'}
              backgroundBlur={false}
              customValue={newMinistryName}
              isCustom={true}
              onChangeCustomInput={onChangeCustomInput}
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
            backgroundColor={isButtonEnabled ? MAIN.DEFAULT : GRAY.SEMI_LIGHT}
            height={30}
            onClick={() => {
              if (targetHistory?.endDate) {
                onClickSaveMinistryGroup &&
                  onClickSaveMinistryGroup(startDate, endDate);
              } else if (selectedMinistryId === CUSTOM_VALUE) {
                onClickCreateMinistry &&
                  onClickCreateMinistry(
                    selectedMinistryGroup.id as string,
                    startDate,
                    newMinistryName
                  );
              } else {
                onClickSaveNewMinistry &&
                  onClickSaveNewMinistry(
                    selectedMinistryGroup.id as string,
                    selectedMinistryId,
                    startDate
                  );
              }
            }}
          />
        </ButtonContainer>
      </ModalContainer>
      <SelectContainer $isShown={isSelectOpened}>
        <SelectMinistryGroup
          value={selectedMinistryGroup.id}
          onClickSave={onChangeMinistryGroup}
          onClickClose={onClickClose}
        />
      </SelectContainer>
    </MinistryGroupModalViewContainer>
  );
};

export default MinistryGroupModalView;
