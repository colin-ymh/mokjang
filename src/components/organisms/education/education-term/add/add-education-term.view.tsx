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
import MemberDropdown from '@/components/atoms/common/dropdown/member-dropdown';
import BigMemberTag from '@/components/atoms/common/tag/big-member-tag';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { BLANK } from '@/constants/constant';
import MemberTag from '@/components/atoms/common/tag/member-tag';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationTermViewContainer = styled.div`
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

const RowCardContainer = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
`;

const MemberTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
`;

type AddEducationTermViewProps = {
  inCharge: MemberDropdownType[];
  onChangeTerm: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (values: MemberDropdownType[]) => void;
  onChangeLocation: (event: ChangeEvent<HTMLInputElement>) => void;
  receivers: MemberDropdownType[];
  onChangeReceivers: (values: MemberDropdownType[]) => void;
  onClickDeleteReceiver: (value: string) => void;
};

const AddEducationTermView = ({
  inCharge,
  onChangeTerm,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeInCharge,
  onChangeLocation,
  receivers,
  onChangeReceivers,
  onClickDeleteReceiver,
}: AddEducationTermViewProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddEducationTermViewContainer>
      {/* 기수 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t('educationTerm')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetEducationTerm.term}
            onChange={onChangeTerm}
            placeholder={t_placeholder('term')}
            borderColor={GRAY.LIGHT}
          />
        </ContentContainer>
      </CardContainer>

      <RowContainer>
        {/* 담당자 */}
        <RowCardContainer>
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
        </RowCardContainer>
        {/* 업무 일정 */}
        <RowCardContainer>
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
                  targetEducationTerm.startDate
                    ? getDateStringFromDate(
                        getDateFromInput(targetEducationTerm.startDate)
                      )
                    : undefined
                }
                selected={
                  targetEducationTerm.startDate
                    ? getDateFromDateString(targetEducationTerm.startDate)
                    : null
                }
                onChange={onChangeStartDate}
                placeholderText={t('startDate')}
              />
              {/* 시작 시간 */}
              <Dropdown
                value={
                  targetEducationTerm.startDate
                    ? getTotalMinuteFromDate(
                        getDateFromDateString(targetEducationTerm.startDate)
                      )
                    : 0
                }
                items={timeDropdownItems}
                onChangeItem={onChangeStartTime}
              />
              {/* 종료 날짜 */}
              <CustomDatePicker
                value={
                  targetEducationTerm.endDate
                    ? getDateStringFromDate(
                        getDateFromInput(targetEducationTerm.endDate)
                      )
                    : undefined
                }
                selected={
                  targetEducationTerm.endDate
                    ? getDateFromDateString(targetEducationTerm.endDate)
                    : null
                }
                onChange={onChangeEndDate}
                placeholderText={t('endDate')}
              />
              {/* 종료 시간 */}
              <Dropdown
                value={
                  targetEducationTerm.endDate
                    ? getTotalMinuteFromDate(
                        getDateFromDateString(targetEducationTerm.endDate)
                      )
                    : 0
                }
                items={timeDropdownItems}
                onChangeItem={onChangeEndTime}
              />
            </PeriodContainer>
          </ContentContainer>
        </RowCardContainer>
      </RowContainer>
      {/* 장소 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('location')}</MainText>
          <BorderInput
            value={targetEducationTerm.location}
            onChange={onChangeLocation}
            placeholder={t_placeholder('location')}
            borderColor={GRAY.LIGHT}
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
    </AddEducationTermViewContainer>
  );
};

export default AddEducationTermView;
