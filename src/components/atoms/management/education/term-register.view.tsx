import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import LabelInput from '@/components/atoms/common/input/label-input';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';

import { useI18n } from '../../../../../locales/client';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const TextContainer = styled.div`
  padding: 30px 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 20px;
  overflow-y: auto;
  margin-bottom: 60px;
`;

const SaveButton = styled.div<{ $isEnabled: boolean }>`
  display: flex;
  position: absolute;
  background-color: ${({ $isEnabled }) =>
    $isEnabled ? MAIN.DEFAULT : GRAY.LIGHT};
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'auto')};
  height: 50px;
  width: 100%;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

type TermRegisterViewProps = {
  term: string;
  session: string;
  startDate: string;
  endDate: string;
  instructorValue: string;
  instructorId: string;
  isSaveEnabled: boolean;
  searchedMembers: DropdownValueType[];
  onChangeTerm: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSession: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEndDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeInstructorValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickInstructor: (id: string) => void;
  onClickSave: () => void;
};

const TermRegisterView = ({
  term,
  session,
  startDate,
  endDate,
  instructorValue,
  instructorId,
  isSaveEnabled,
  searchedMembers,
  onChangeTerm,
  onChangeSession,
  onChangeStartDate,
  onChangeEndDate,
  onChangeInstructorValue,
  onClickInstructor,
  onClickSave,
}: TermRegisterViewProps) => {
  const t = useI18n();
  return (
    <RegisterContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t('register.termHeaderPhrase')}
        </MainText>
      </TextContainer>
      <ContentContainer>
        <LabelInput
          label={`${t('education')} ${t('term')}`}
          value={term}
          onChange={onChangeTerm}
        />
        <LabelInput
          label={`${t('education')} ${t('session')}`}
          value={session}
          onChange={onChangeSession}
        />
        <LabelInput
          label={`${t('education')} ${t('startDate')}`}
          value={startDate}
          onChange={onChangeStartDate}
        />
        <LabelInput
          label={`${t('education')} ${t('endDate')}`}
          value={endDate}
          onChange={onChangeEndDate}
        />
        <LabelDropdown
          label={`${t('education')} ${t('instructor')}`}
          value={instructorValue}
          items={searchedMembers}
          onChangeItem={onClickInstructor}
          onChange={onChangeInstructorValue}
          isEditable={true}
        />
      </ContentContainer>
      <SaveButton $isEnabled={isSaveEnabled} onClick={onClickSave}>
        <MainText color={WHITE}>{t('button.saveTerm')}</MainText>
      </SaveButton>
    </RegisterContainer>
  );
};

export default TermRegisterView;
