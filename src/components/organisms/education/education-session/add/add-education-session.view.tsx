'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
import { useTimeDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { EDUCATION_SESSION_STATUS } from '@/constants/status/status';
import MemberDropdown from '@/components/atoms/common/dropdown/member-dropdown';
import BigMemberTag from '@/components/atoms/common/tag/big-member-tag';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { EducationAttendance } from '@/models/education/education';
import Quill from '@/components/atoms/common/input/quill';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationSessionViewContainer = styled.div`
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
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const PeriodContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const MemberTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
`;

type AddEducationSessionViewProps = {
  content: string;
  inCharge: MemberDropdownType[];
  onChangeStatus: (value: EDUCATION_SESSION_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (values: MemberDropdownType[]) => void;
  onChangeContent: (content: string) => void;
  receivers: MemberDropdownType[];
  onChangeReceivers: (values: MemberDropdownType[]) => void;
  // onClickDeleteReceiver: (value: string) => void;
  onChangeAttendanceStatus: (
    value: boolean,
    targetAttendance: EducationAttendance
  ) => void;
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

  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddEducationSessionViewContainer>
      {/* 기수 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t('title')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetEducationSession.title}
            onChange={onChangeTitle}
            placeholder={t_placeholder('title')}
            borderColor={GRAY.LIGHT}
          />
        </ContentContainer>
      </CardContainer>

      {/* 업무 일정 */}
      <CardContainer>
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
                targetEducationSession.startDate
                  ? getDateStringFromDate(
                      getDateFromInput(targetEducationSession.startDate)
                    )
                  : undefined
              }
              selected={
                targetEducationSession.startDate
                  ? getDateFromDateString(targetEducationSession.startDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetEducationSession.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromDateString(targetEducationSession.startDate)
                    )
                  : 0
              }
              items={timeDropdownItems}
              onChangeItem={onChangeStartTime}
            />
            {/* 종료 날짜 */}
            <CustomDatePicker
              value={
                targetEducationSession.endDate
                  ? getDateStringFromDate(
                      getDateFromInput(targetEducationSession.endDate)
                    )
                  : undefined
              }
              selected={
                targetEducationSession.endDate
                  ? getDateFromDateString(targetEducationSession.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetEducationSession.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromDateString(targetEducationSession.endDate)
                    )
                  : 0
              }
              items={timeDropdownItems}
              onChangeItem={onChangeEndTime}
            />
          </PeriodContainer>
        </ContentContainer>
      </CardContainer>

      {/* 상태 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('educationStatus')}</MainText>
        </ContentContainer>
      </CardContainer>

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

      {/* 내용 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('content')}</MainText>
          <Quill
            value={targetEducationSession.content}
            onChange={(html) => onChangeContent(html)}
            minHeight={150}
            placeholder={t_placeholder('content')}
          />
        </ContentContainer>
      </CardContainer>

      <CardContainer>
        {/*<ContentContainer>*/}
        {/*  /!* 보고대상자 *!/*/}
        {/*  <MainText size={SIZE.EXTRA_LARGE}>{t('receiver')}</MainText>*/}
        {/*  <MemberDropdown*/}
        {/*    values={receivers}*/}
        {/*    onChangeValues={onChangeReceivers}*/}
        {/*    placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}*/}
        {/*    isManager={true}*/}
        {/*  />*/}
        {/*  /!* 보고대상자 목록 *!/*/}
        {/*  <MemberTagList>*/}
        {/*    {receivers.map((member) => (*/}
        {/*      <MemberTag*/}
        {/*        key={member.value}*/}
        {/*        profileImage={member.profileImage}*/}
        {/*        name={member.title}*/}
        {/*        officer={member.officer}*/}
        {/*        onClick={() => onClickDeleteReceiver(member.value)}*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </MemberTagList>*/}
        {/*</ContentContainer>*/}
      </CardContainer>
    </AddEducationSessionViewContainer>
  );
};

export default AddEducationSessionView;
