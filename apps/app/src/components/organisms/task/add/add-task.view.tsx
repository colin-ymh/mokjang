'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, LOCALE } from '@mokjang/constants';
import { useTimeDropdownItems } from '../../../../hooks/dropdown/dropdown-items';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { BorderInput, MainText, RequiredMark } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import CustomDatePicker from '../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@mokjang/utils';
import Dropdown from '../../../atoms/common/dropdown/dropdown';
import MemberDropdown from '../../../atoms/common/dropdown/member-dropdown';
import Quill from '../../../atoms/common/input/quill';
import MemberTag from '../../../atoms/common/tag/member-tag';
import BigMemberTag from '../../../atoms/common/tag/big-member-tag';
import { usePathname } from 'next/navigation';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddTaskViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  padding-bottom: 150px;
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

const ReceiverTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
  height: 30px;
  flex-shrink: 0;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const PeriodContainer = styled.div`
  //display: grid;
  //grid-template-columns: repeat(2, 1fr);
  display: flex;
  flex-direction: row;
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
  onChangeContent: (content: string, delta: any, source: string) => void;
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
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const { targetTask } = useSelector((state: RootState) => state.targetTask);
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const timeDropdownItems = useTimeDropdownItems(locale);

  return (
    <AddTaskViewContainer>
      {/*/!* 제목 *!/*/}
      {/*<HeaderContainer>*/}
      {/*  <MainText fontWeight=600} fontSize={22}>*/}
      {/*    {t(isEdit ? 'title.editTask' : 'title.addTask')}*/}
      {/*  </MainText>*/}
      {/*</HeaderContainer>*/}
      <ContentContainer>
        <MainText fontWeight={600}>
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

      {/* 담당자 */}
      <ContentContainer>
        <MainText fontWeight={600}>
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
          <MainText fontWeight={600}>
            {t('period')}
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
                    getDateFromDateString(targetTask.startDate)
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
            chevronColor={GRAY.DEFAULT}
          />
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
            chevronColor={GRAY.DEFAULT}
          />
        </PeriodContainer>
      </ContentContainer>

      {/* 세부 내용 */}
      <ContentContainer>
        <MainText fontWeight={600}>{t('content')}</MainText>
        <Quill
          value={content}
          onChange={(content, delta, source) =>
            onChangeContent(content, delta, source)
          }
          minHeight={150}
          placeholder={t_placeholder('content')}
        />
      </ContentContainer>

      <ContentContainer>
        {/* 보고대상자 */}
        <MainText fontWeight={600}>{t('receiver')}</MainText>
        <MemberDropdown
          values={receivers}
          onChangeValues={onChangeReceivers}
          placeholder={t_placeholder('name')}
          isManager={true}
        />
        {/* 보고대상자 목록 */}
        <ReceiverTagList>
          {receivers.map((member) => (
            <MemberTag
              key={member.value}
              profileImage={member.profileImage}
              name={member.title}
              officer={member.officer}
              onClick={() => onClickDeleteReceiver(member.value)}
            />
          ))}
        </ReceiverTagList>
      </ContentContainer>
    </AddTaskViewContainer>
  );
};

export default AddTaskView;
