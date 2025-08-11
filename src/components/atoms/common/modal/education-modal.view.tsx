import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import Button from '@/components/atoms/common/button/button';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import LabelInput from '@/components/atoms/common/input/label-input';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';

import { useI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import { GRAY, MAIN } from '@/constants/styles/color';

import { EDUCATION_ENROLLMENT_STATUS } from '@/constants/status/status';

const EducationModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
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

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

type EducationModalViewProps = {
  isEdit: boolean;
  educationId: string;
  educationStatus: EDUCATION_ENROLLMENT_STATUS;
  educationItems: DropdownValueType[];
  startDate: string;
  endDate: string;
  isButtonEnabled: boolean;
  onClickClose: () => void;
  onChangeEducation: (id: string) => void;
  onChangeStatus: (value: EDUCATION_ENROLLMENT_STATUS) => void;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveNewEducation: (
    educationId: string,
    startDate: string,
    status: EDUCATION_ENROLLMENT_STATUS,
    endDate?: string
  ) => void;
  onClickSaveEditEducation: (
    educationId?: string,
    startDate?: string,
    endDate?: string,
    status?: EDUCATION_ENROLLMENT_STATUS
  ) => void;
};

const EducationModalView = ({
  isEdit,
  educationId,
  educationStatus,
  educationItems,
  startDate,
  endDate,
  isButtonEnabled,
  onClickClose,
  onChangeEducation,
  onChangeStatus,
  onChangeStartDate,
  onChangeEndDate,
  onClickSaveNewEducation,
  onClickSaveEditEducation,
}: EducationModalViewProps) => {
  const t = useI18n();
  const statusItems = useTaskStatusDropdownItems();

  return (
    <EducationModalViewContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton onClick={onClickClose} />
      </HeaderContainer>
      {/* 내용 */}
      <ContentContainer>
        {/* 교육 선택 */}
        <LabelDropdown
          label={t('education')}
          value={educationId}
          items={educationItems}
          onChangeItem={onChangeEducation}
        />
        {/* 상태 선택 */}
        <LabelDropdown
          label={t('educationStatus')}
          value={educationStatus}
          items={statusItems}
          onChangeItem={onChangeStatus}
        />
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
          backgroundColor={isButtonEnabled ? MAIN.DEFAULT : GRAY.SEMI_LIGHT}
          height={30}
          onClick={() => {
            if (isEdit) {
              onClickSaveEditEducation(
                educationId,
                startDate,
                endDate,
                educationStatus
              );
            } else {
              onClickSaveNewEducation(
                educationId,
                startDate,
                educationStatus,
                endDate
              );
            }
          }}
        />
      </ButtonContainer>
    </EducationModalViewContainer>
  );
};

export default EducationModalView;
