'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '@mokjang/constants';
import { useTimeDropdownItems } from '../../../../hooks/dropdown/dropdown-items';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { MainText } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { RequiredMark } from '@mokjang/components';
import { BorderInput } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@mokjang/utils';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import MemberDropdown from '../../../atoms/common/dropdown/member-dropdown';
import { BLANK } from '@mokjang/constants';
import Quill from '../../../atoms/common/input/quill';
import MemberTag from '../../../atoms/common/tag/member-tag';
import BigMemberTag from '../../../atoms/common/tag/big-member-tag';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddTaskViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
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
  isEdit: boolean;
  content: string;
  inCharge: MemberDropdownType[];
  receivers: MemberDropdownType[];
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
  isEdit,
  inCharge,
  receivers,
  content,
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

  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddTaskViewContainer>
      {/*/!* 제목 *!/*/}
      {/*<HeaderContainer>*/}
      {/*  <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>*/}
      {/*    {t(isEdit ? 'title.editTask' : 'title.addTask')}*/}
      {/*  </MainText>*/}
      {/*</HeaderContainer>*/}
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

      <RowContainer>
        {/* 담당자 */}
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
        {/* 일정 */}
        <ContentContainer>
          <RowContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('schedule')}
              <RequiredMark />
            </MainText>
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
                  ? getDateStringFromDate(getDateFromInput(targetTask.endDate))
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
      </RowContainer>

      {/* 세부 내용 */}
      <ContentContainer>
        <MainText size={SIZE.EXTRA_LARGE}>{t('content')}</MainText>
        <Quill
          value={content}
          onChange={(html) => onChangeContent(html)}
          minHeight={150}
          placeholder={t_placeholder('content')}
        />
      </ContentContainer>

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
    </AddTaskViewContainer>
  );
};

export default AddTaskView;
