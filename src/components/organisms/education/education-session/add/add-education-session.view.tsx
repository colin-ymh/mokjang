import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Quill from '@/components/atoms/common/input/quill';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import {
  useEducationSessionStatusDropdownItems,
  useTimeDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import { BLANK } from '@/constants/constant';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@/utils/date';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import { EducationAttendance } from '@/models/education/education';

const AddEducationSessionViewContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 20px;
  overflow-y: auto;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const RequiredMark = styled.span`
  color: red;
  margin-right: 4px;
`;

type AddEducationSessionViewProps = {
  inCharge: DropdownValueType[];
  content: string;
  receivers: MemberDropdownValueType[];
  onChangeStatus: (value: EDUCATION_SESSION_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (values: DropdownValueType[]) => void;
  onChangeContent: (content: string) => void;
  onChangeAttendanceStatus: (
    value: boolean,
    educationAttendance: EducationAttendance
  ) => void;
  onChangeReceivers: (values: MemberDropdownValueType[]) => void;
};

const AddEducationSessionView = ({
  content,
  inCharge,
  receivers,
  onChangeStatus,
  onChangeTitle,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeInCharge,
  onChangeContent,
  onChangeReceivers,
  onChangeAttendanceStatus,
}: AddEducationSessionViewProps) => {
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useEducationSessionStatusDropdownItems();
  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddEducationSessionViewContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetEducationSession.status}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={40}
        />
      </InputContainer>
      {/* 제목 */}
      <InputContainer>
        <LabelInput
          label={t('title')}
          value={targetEducationSession.title}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.DEFAULT}
          height={40}
          isRequired={true}
        />
      </InputContainer>

      {/* 기간 */}
      <InputContainer>
        <LabelContainer>
          <MainText>
            <RequiredMark>*</RequiredMark>
            {t('period')}
          </MainText>
          <PeriodContainer>
            {/* 시작 날짜 */}
            <CustomDatePicker
              value={
                targetEducationSession.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetEducationSession.startDate)
                    )
                  : undefined
              }
              selected={
                targetEducationSession.startDate
                  ? getDateFromString(targetEducationSession.startDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
              width={100}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetEducationSession.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetEducationSession.startDate)
                    )
                  : 0
              }
              items={timeDropdownItems}
              onChangeItem={onChangeStartTime}
              width={100}
            />
            <MainText>-</MainText>
            {/* 종료 날짜 */}
            <CustomDatePicker
              value={
                targetEducationSession.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetEducationSession.endDate)
                    )
                  : undefined
              }
              selected={
                targetEducationSession.endDate
                  ? getDateFromString(targetEducationSession.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              width={100}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetEducationSession.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetEducationSession.endDate)
                    )
                  : 0
              }
              items={timeDropdownItems}
              onChangeItem={onChangeEndTime}
              width={100}
            />
          </PeriodContainer>
        </LabelContainer>
      </InputContainer>

      {/* 내용 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('content')}</MainText>
          <Quill
            value={content}
            onChange={(event) => onChangeContent(event)}
            minHeight={120}
            placeholder={t_placeholder('content')}
          />
        </LabelContainer>
      </InputContainer>

      {/* 담당자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>
            <RequiredMark>*</RequiredMark>
            {t('inCharge')}
          </MainText>
          <MultiMemberDropdown
            values={inCharge}
            onChangeValues={onChangeInCharge}
            height={40}
            isSingle={true}
            placeholder={inCharge.length === 0 ? t_placeholder('name') : BLANK}
            isUserMember={true}
          />
        </LabelContainer>
      </InputContainer>
      {/* 보고대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('receiver')}</MainText>
          <MultiMemberDropdown
            values={receivers}
            onChangeValues={onChangeReceivers}
            height={40}
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
            isUserMember={true}
          />
        </LabelContainer>
      </InputContainer>
    </AddEducationSessionViewContainer>
  );
};

export default AddEducationSessionView;
