import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN } from '@/constants/styles/color';
import { MinistryGroup } from '@/models/management/management';
import { MinistryHistory } from '@/models/member/history';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';

import { useI18n } from '../../../../../locales/client';

const MinistryModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

type MinistryModalViewProps = {
  isHistory: boolean;
  prevMinistry?: MinistryHistory;
  ministryDropdownItems: DropdownValueType[];
  selectedMinistryGroup: MinistryGroup;
  selectedMinistryId: string;
  isButtonEnabled: boolean;
  startDate: string;
  endDate: string;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveCurrentMinistry?: (groupId: string, startDate: string) => void;
  onClickSaveMinistryHistory?: (startDate: string, endDate: string) => void;
  onClickSaveMinistry: (group: MinistryGroup) => void;
  onChangeMinistryId: (id: string) => void;
};

const MinistryModalView = ({
  isHistory,
  prevMinistry,
  ministryDropdownItems,
  selectedMinistryGroup,
  selectedMinistryId,
  isButtonEnabled,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onClickSaveMinistry,
  onChangeMinistryId,
  onClickSaveCurrentMinistry,
  onClickSaveMinistryHistory,
}: MinistryModalViewProps) => {
  const t = useI18n();

  return (
    <MinistryModalViewContainer>
      {/* 내용 */}
      <ContentContainer>
        {/* 소그룹 선택 드롭다운 부분*/}
        {/*{!isHistory && (*/}
        {/*  <MinistryDropdown*/}
        {/*    value={selectedMinistry?.name || t('none')}*/}
        {/*    isHistory={isHistory}*/}
        {/*    onClickSaveMinistry={onClickSaveMinistry}*/}
        {/*  />*/}
        {/*)}*/}
        {/* 역할 */}
        {!isHistory && (
          <LabelDropdown
            label={t('groupRole')}
            value={selectedMinistryId}
            items={ministryDropdownItems}
            onChangeItem={onChangeMinistryId}
            disabled={isHistory}
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
        <LabelInput
          label={t('endDate')}
          value={endDate}
          onChange={onChangeEndDate}
          placeholder={t('placeholder.endDate')}
        />
      </ContentContainer>
      {/* 버튼 */}
      <ButtonContainer>
        <Button
          text={t('button.save')}
          disabled={!isButtonEnabled}
          backgroundColor={isButtonEnabled ? MAIN.DEFAULT : GRAY.LIGHT}
          height={30}
          onClick={() => {
            if (isHistory) {
              onClickSaveMinistryHistory &&
                onClickSaveMinistryHistory(startDate, endDate);
            } else {
              onClickSaveCurrentMinistry &&
                onClickSaveCurrentMinistry(selectedMinistryId, startDate);
            }
          }}
        />
      </ButtonContainer>
    </MinistryModalViewContainer>
  );
};

export default MinistryModalView;
