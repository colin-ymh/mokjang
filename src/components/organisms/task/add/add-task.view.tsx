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

const RequiredMark = styled.span`
  color: red;
  margin-right: 4px;
`;

type AddTaskViewProps = {
  inCharge: DropdownValueType[];
  receivers: DropdownValueType[];
  comment: string;
  onChangeStatus: (status: TASK_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (inCharge: MemberDropdownValueType[]) => void;
  onChangeComment: (comment: string) => void;
  onChangeReceivers: (receivers: DropdownValueType[]) => void;
};

const AddTaskView = ({
  inCharge,
  receivers,
  comment,
  onChangeStatus,
  onChangeTitle,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeInCharge,
  onChangeComment,
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
          value={targetTask.taskStatus}
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
                targetTask.taskStartDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetTask.taskStartDate)
                    )
                  : undefined
              }
              selected={
                targetTask.taskStartDate
                  ? getDateFromString(targetTask.taskStartDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
              width={100}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetTask.taskStartDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetTask.taskStartDate)
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
                targetTask.taskEndDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetTask.taskEndDate)
                    )
                  : undefined
              }
              selected={
                targetTask.taskEndDate
                  ? getDateFromString(targetTask.taskEndDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              width={100}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetTask.taskEndDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetTask.taskEndDate)
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

      {/* 내용 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('comment')}</MainText>
          <Quill
            value={comment}
            onChange={(event) => onChangeComment(event)}
            minHeight={120}
            placeholder={t_placeholder('comment')}
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
    </AddTaskViewContainer>
  );
};

export default AddTaskView;
