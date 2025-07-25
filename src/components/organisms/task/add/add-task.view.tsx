'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, WHITE } from '@/constants/styles/color';
import {
  useTaskStatusDropdownItems,
  useTimeDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { TASK_STATUS } from '@/constants/status/status';
import RequiredMark from '@/components/atoms/common/text/required-mark';
import BorderInput from '@/components/atoms/common/input/border-input';
import { SIZE } from '@/constants/styles/style';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@/utils/date';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import MemberDropdown from '@/components/atoms/common/dropdown/member-dropdown';
import { BLANK } from '@/constants/constant';
import Quill from '@/components/atoms/common/input/quill';
import MemberTag from '@/components/atoms/common/tag/member-tag';
import BigMemberTag from '@/components/atoms/common/tag/big-member-tag';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddTaskViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const MemberTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const PeriodContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
`;

type AddTaskViewProps = {
  content: string;
  inCharge: MemberDropdownType[];
  receivers: MemberDropdownType[];
  onChangeStatus: (status: TASK_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (event: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (event: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (inCharge: MemberDropdownType[]) => void;
  onChangeReceivers: (receiver: MemberDropdownType[]) => void;
  onChangeContent: (content: string) => void;
  onClickDeleteReceiver: (memberId: string) => void;
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
  onClickDeleteReceiver,
}: AddTaskViewProps) => {
  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useTaskStatusDropdownItems();
  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddTaskViewContainer>
      {/* 제목 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t('title')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetTask.title}
            onChange={onChangeTitle}
            placeholder={t_placeholder('title')}
            borderColor={GRAY.LIGHT}
          />
        </ContentContainer>
      </CardContainer>

      <RowContainer>
        {/* 담당자 */}
        <CardContainer>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('inCharge')}
              <RequiredMark />
            </MainText>
            {inCharge.length === 0 ? (
              <MemberDropdown
                values={inCharge}
                onChangeValues={onChangeInCharge}
                isSingle
                placeholder={t_placeholder('name')}
                isManager={true}
              />
            ) : (
              <BigMemberTag
                officer={inCharge[0].officer}
                profileImage={inCharge[0].profileImage}
                name={inCharge[0].title}
                onClick={() => onChangeInCharge([])}
              />
            )}
          </ContentContainer>
        </CardContainer>
        {/* 일정 */}
        <CardContainer>
          <ContentContainer>
            <RowContainer>
              <MainText size={SIZE.EXTRA_LARGE}>
                {t('schedule')}
                <RequiredMark />
              </MainText>
              <StatusDropdown
                value={targetTask.status}
                items={statusDropdownItems}
                onChangeItem={onChangeStatus}
                width={100}
                height={40}
              />
            </RowContainer>
            {/* 기간 */}
            <PeriodContainer>
              {/* 시작 날짜 */}
              <CustomDatePicker
                value={
                  targetTask.startDate
                    ? getDateStringFromDate(
                        getDateFromInput(targetTask.startDate)
                      )
                    : undefined
                }
                selected={
                  targetTask.startDate
                    ? getDateFromDateString(targetTask.startDate)
                    : null
                }
                onChange={onChangeStartDate}
                placeholderText={t('startDate')}
              />
              {/* 시작 시간 */}
              <Dropdown
                value={
                  targetTask.startDate
                    ? getTotalMinuteFromDate(
                        getDateFromDateString(targetTask.startDate)
                      )
                    : 0
                }
                items={timeDropdownItems}
                onChangeItem={onChangeStartTime}
              />
              {/* 종료 날짜 */}
              <CustomDatePicker
                value={
                  targetTask.endDate
                    ? getDateStringFromDate(
                        getDateFromInput(targetTask.endDate)
                      )
                    : undefined
                }
                selected={
                  targetTask.endDate
                    ? getDateFromDateString(targetTask.endDate)
                    : null
                }
                onChange={onChangeEndDate}
                placeholderText={t('endDate')}
              />
              {/* 종료 시간 */}
              <Dropdown
                value={
                  targetTask.endDate
                    ? getTotalMinuteFromDate(
                        getDateFromDateString(targetTask.endDate)
                      )
                    : 0
                }
                items={timeDropdownItems}
                onChangeItem={onChangeEndTime}
              />
            </PeriodContainer>
          </ContentContainer>
        </CardContainer>
      </RowContainer>

      {/* 세부 내용 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('content')}</MainText>
          <Quill
            value={content}
            onChange={(html) => onChangeContent(html)}
            minHeight={150}
            placeholder={t_placeholder('content')}
          />
        </ContentContainer>
      </CardContainer>

      <CardContainer>
        <ContentContainer>
          {/* 보고대상자 */}
          <MainText size={SIZE.EXTRA_LARGE}>{t('receiver')}</MainText>
          <MemberDropdown
            values={receivers}
            onChangeValues={onChangeReceivers}
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
            isManager={true}
          />
          {/* 보고대상자 목록 */}
          <MemberTagList>
            {receivers.map((member) => (
              <MemberTag
                key={member.value}
                profileImage={member.profileImage}
                name={member.title}
                officer={member.officer}
                onClick={() => onClickDeleteReceiver(member.value)}
              />
            ))}
          </MemberTagList>
        </ContentContainer>
      </CardContainer>
    </AddTaskViewContainer>
  );
};

export default AddTaskView;
