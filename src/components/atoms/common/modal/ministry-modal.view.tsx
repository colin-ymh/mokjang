import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { MinistryGroup } from '@/models/management/management';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import MinistryGroupDropdown from '@/components/atoms/common/dropdown/ministry-group-dropdown';
import { MinistryHistory } from '@/models/member/history';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';

const MinistryGroupModalViewContainer = styled.div`
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

const MinistryGroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
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
};

const MinistryGroupModalView = ({
  targetHistory,
  selectedMinistryGroup,
  ministryItems,
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
}: MinistryGroupModalViewProps) => {
  const t = useI18n();

  return (
    <MinistryGroupModalViewContainer>
      {/* 내용 */}
      <ContentContainer>
        <MinistryGroupContainer>
          {/* 그룹 */}
          <MinistryGroupDropdown
            value={selectedMinistryGroup.id as string}
            onClickSaveMinistryGroup={onChangeMinistryGroup}
          />
          <Button width={42} height={42} onClick={onClickCancelMinistryGroup}>
            <CancelButton />
          </Button>
        </MinistryGroupContainer>
        {/* 역할 */}
        {selectedMinistryGroup.id && !targetHistory?.endDate && (
          <LabelDropdown
            label={t('ministry')}
            value={selectedMinistryId}
            items={ministryItems}
            onChangeItem={onChangeMinistryId}
          />
        )}
        {/* 시작 날짜 */}
        {selectedMinistryGroup.id && (
          <LabelInput
            label={t('startDate')}
            value={startDate}
            onChange={onChangeStartDate}
            placeholder={t('placeholder.startDate')}
          />
        )}
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
              onClickSaveMinistryGroup &&
                onClickSaveMinistryGroup(startDate, endDate);
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
    </MinistryGroupModalViewContainer>
  );
};

export default MinistryGroupModalView;
