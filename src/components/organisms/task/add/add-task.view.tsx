import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { BLANK } from '@/constants/constant';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import {
  useTaskStatusDropdownItems,
  useTimeDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import Quill from '@/components/atoms/common/input/quill';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@/utils/date';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { TASK_STATUS } from '@/constants/status/status';
import RequiredMark from '@/components/atoms/common/text/required-mark';

const AddTaskViewContainer = styled.div`
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

type AddTaskViewProps = {
  inCharge: DropdownValueType[];
  receivers: DropdownValueType[];
  content: string;
  onChangeStatus: (status: TASK_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (inCharge: MemberDropdownValueType[]) => void;
  onChangeContent: (content: string) => void;
  onChangeReceivers: (receivers: DropdownValueType[]) => void;
};

const AddTaskView = ({
  inCharge,
  receivers,
  content,
  onChangeStatus,
  onChangeTitle,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeInCharge,
  onChangeContent,
  onChangeReceivers,
}: AddTaskViewProps) => {
  const { targetTask } = useSelector((state: RootState) => state.targetTask);

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useTaskStatusDropdownItems();
  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddTaskViewContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetTask.status}
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
          value={targetTask.title}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.LIGHT}
          height={40}
          isRequired={true}
        />
      </InputContainer>

      {/* 기간 */}
      <InputContainer>
        <LabelContainer>
          <MainText>
            <RequiredMark />
            {t('period')}
          </MainText>
          <PeriodContainer>
            {/* 시작 날짜 */}
            <CustomDatePicker
              value={
                targetTask.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetTask.startDate)
                    )
                  : undefined
              }
              selected={
                targetTask.startDate
                  ? getDateFromString(targetTask.startDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
              width={100}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetTask.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetTask.startDate)
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
                targetTask.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetTask.endDate)
                    )
                  : undefined
              }
              selected={
                targetTask.endDate
                  ? getDateFromString(targetTask.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              width={100}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetTask.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetTask.endDate)
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

      {/* 담당자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>
            <RequiredMark />
            {t('inCharge')}
          </MainText>
          <MultiMemberDropdown
            values={inCharge}
            onChangeValues={onChangeInCharge}
            height={40}
            isSingle={true}
            placeholder={inCharge.length === 0 ? t_placeholder('name') : BLANK}
            isManager={true}
          />
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

      {/* 보고대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('receiver')}</MainText>
          <MultiMemberDropdown
            values={receivers}
            onChangeValues={onChangeReceivers}
            height={40}
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
            isManager={true}
          />
        </LabelContainer>
      </InputContainer>
    </AddTaskViewContainer>
  );
};

export default AddTaskView;
