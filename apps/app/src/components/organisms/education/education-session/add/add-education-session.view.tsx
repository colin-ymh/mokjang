'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { RequiredMark } from '@mokjang/components';
import { BorderInput } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@mokjang/utils';
import Dropdown from '../../../../atoms/common/dropdown/dropdown';
import { useTimeDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';
import Quill from '../../../../atoms/common/input/quill';
import MemberDropdown from '../../../../atoms/common/dropdown/member-dropdown';
import MemberTag from '../../../../atoms/common/tag/member-tag';
import BigMemberTag from '../../../../atoms/common/tag/big-member-tag';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationSessionViewContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  min-height: 800px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const PeriodContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
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
  isEdit: boolean;
  inCharge: MemberDropdownType[];
  content: string;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (values: MemberDropdownType[]) => void;
  onChangeContent: (content: string) => void;
  receivers: MemberDropdownType[];
  onChangeReceivers: (values: MemberDropdownType[]) => void;
  onClickDeleteReceiver: (value: string) => void;
};

const AddEducationSessionView = ({
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
}: AddEducationSessionViewProps) => {
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddEducationSessionViewContainer>
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {t(
            isEdit ? 'title.editEducationSession' : 'title.addEducationSession'
          )}
        </MainText>
      </HeaderContainer>
      <ContentContainer>
        {/* 회차명 */}
        <ColumnContainer>
          <MainText>
            {t('title')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetEducationSession.title}
            onChange={onChangeTitle}
            placeholder={t_placeholder('title')}
            borderColor={GRAY.LIGHT}
            maxLength={50}
          />
        </ColumnContainer>

        <RowContainer>
          {/* 담당자 */}
          <ColumnContainer>
            <MainText>
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
          </ColumnContainer>

          {/* 업무 일정 */}
          <ColumnContainer>
            <RowContainer>
              <MainText>
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
          </ColumnContainer>
        </RowContainer>

        {/* 내용 */}
        <ColumnContainer>
          <MainText>{t('content')}</MainText>
          <Quill
            value={content}
            onChange={(html) => onChangeContent(html)}
            minHeight={150}
            placeholder={t_placeholder('content')}
            maxLength={1000}
          />
        </ColumnContainer>

        {/* 보고대상자 */}
        <ColumnContainer>
          <MainText>{t('receiver')}</MainText>
          <MemberDropdown
            values={receivers}
            onChangeValues={onChangeReceivers}
            placeholder={t_placeholder('name')}
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
        </ColumnContainer>
      </ContentContainer>
    </AddEducationSessionViewContainer>
  );
};

export default AddEducationSessionView;
