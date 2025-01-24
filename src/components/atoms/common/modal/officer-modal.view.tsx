import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import LabelInput from '@/components/atoms/common/input/label-input';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';

import { useI18n } from '../../../../../locales/client';
import { useOfficerDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { OfficerHistory } from '@/models/member/history';
import Cancel from '../../../../../public/svg/cancel.svg';
import { NONE } from '@/constants/constant';

const OfficerModalViewContainer = styled.div`
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

const GroupContainer = styled.div`
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

type OfficerModalViewProps = {
  targetHistory: OfficerHistory | undefined;
  selectedOfficerId: string;
  isButtonEnabled: boolean;
  startDate: string;
  endDate: string;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewOfficer?: (officerId: string, startDate: string) => void;
  onClickSaveOfficerHistory?: (startDate?: string, endDate?: string) => void;
  onClickCancelOfficer?: () => void;
  onChangeOfficerId: (id: string) => void;
};

const OfficerModalView = ({
  targetHistory,
  selectedOfficerId,
  isButtonEnabled,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  onChangeOfficerId,
  onClickSaveNewOfficer,
  onClickSaveOfficerHistory,
  onClickCancelOfficer,
}: OfficerModalViewProps) => {
  const t = useI18n();
  const officerDropdownItems = useOfficerDropdownItems();

  return (
    <OfficerModalViewContainer>
      {/* 내용 */}
      <ContentContainer>
        <GroupContainer>
          {/* 직분 */}
          {!targetHistory?.endDate && (
            <LabelDropdown
              label={t('officer')}
              value={selectedOfficerId}
              items={officerDropdownItems}
              onChangeItem={onChangeOfficerId}
            />
          )}
          <Button width={38} height={38} onClick={onClickCancelOfficer}>
            <CancelButton />
          </Button>
        </GroupContainer>
        {/* 시작 날짜 */}
        {selectedOfficerId !== NONE && (
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
              onClickSaveOfficerHistory &&
                onClickSaveOfficerHistory(startDate, endDate);
            } else {
              onClickSaveNewOfficer &&
                onClickSaveNewOfficer(selectedOfficerId, startDate);
            }
          }}
        />
      </ButtonContainer>
    </OfficerModalViewContainer>
  );
};

export default OfficerModalView;
