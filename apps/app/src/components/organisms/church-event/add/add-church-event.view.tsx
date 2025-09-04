import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { LabelInput } from '@mokjang/components';
import { LabelTextarea } from '@mokjang/components';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { getDateFromInput } from '@mokjang/utils';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import React from 'react';
import { MainText } from '@mokjang/components';
import { RequiredMark } from '@mokjang/components';

const AddChurchEventViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const LabelInputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  padding: 10px;
`;

type AddChurchEventViewProps = {
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChurchEventDate: (date: Date | null) => void;
};

const AddChurchEventView = ({
  onChangeTitle,
  onChangeDescription,
  onChangeChurchEventDate,
}: AddChurchEventViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  return (
    <AddChurchEventViewContainer>
      <LabelInput
        label={t('title')}
        placeholder={t_placeholder('title')}
        value={targetChurchEvent.title}
        onChange={onChangeTitle}
        isRequired={true}
      />
      <LabelContainer>
        <MainText>
          <RequiredMark />
          {t('period')}
        </MainText>
        <CustomDatePicker
          selected={
            targetChurchEvent.date
              ? getDateFromInput(targetChurchEvent.date)
              : null
          }
          onChange={onChangeChurchEventDate}
          placeholderText={t_placeholder('date')}
          width={460}
        />
      </LabelContainer>
      <LabelTextarea
        label={t('description')}
        placeholder={t_placeholder('description')}
        value={targetChurchEvent.description}
        onChange={onChangeDescription}
      />
    </AddChurchEventViewContainer>
  );
};

export default AddChurchEventView;
