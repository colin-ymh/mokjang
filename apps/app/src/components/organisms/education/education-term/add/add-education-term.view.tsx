'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { BLANK, GRAY, LOCALE, SIZE } from '@mokjang/constants';
import { BorderInput, MainText, RequiredMark } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@mokjang/utils';
import Dropdown from '../../../../atoms/common/dropdown/dropdown';
import { useTimeDropdownItems } from '../../../../../hooks/dropdown/dropdown-items';
import MemberDropdown from '../../../../atoms/common/dropdown/member-dropdown';
import BigMemberTag from '../../../../atoms/common/tag/big-member-tag';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';
import MemberTag from '../../../../atoms/common/tag/member-tag';
import { usePathname } from 'next/navigation';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationTermViewContainer = styled.div`
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

type AddEducationTermViewProps = {
  isEdit: boolean;
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
  isEdit,
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
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const timeDropdownItems = useTimeDropdownItems(locale);

  return (
    <AddEducationTermViewContainer>
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {t(isEdit ? 'title.editEducationTerm' : 'title.addEducationTerm')}
        </MainText>
      </HeaderContainer>
      <ContentContainer>
        {/* 기수 */}
        <ColumnContainer>
          <MainText>
            {t('educationTerm')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetEducationTerm.term}
            onChange={onChangeTerm}
            placeholder={t_placeholder('term')}
            borderColor={GRAY.LIGHT}
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
                  targetEducationTerm.startDate
                    ? getDateStringFromDate(
                        getDateFromDateString(targetEducationTerm.startDate)
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
                    : 8 * 60
                }
                items={timeDropdownItems}
                onChangeItem={onChangeStartTime}
              />
              {/* 종료 날짜 */}
              <CustomDatePicker
                value={
                  targetEducationTerm.endDate
                    ? getDateStringFromDate(
                        getDateFromDateString(targetEducationTerm.endDate)
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
                    : 8 * 60
                }
                items={timeDropdownItems}
                onChangeItem={onChangeEndTime}
              />
            </PeriodContainer>
          </ColumnContainer>
        </RowContainer>
        {/* 장소 */}

        <ColumnContainer>
          <MainText>{t('location')}</MainText>
          <BorderInput
            value={targetEducationTerm.location || BLANK}
            onChange={onChangeLocation}
            placeholder={t_placeholder('location')}
            borderColor={GRAY.LIGHT}
            maxLength={30}
          />
        </ColumnContainer>

        <ColumnContainer>
          {/* 보고대상자 */}
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
    </AddEducationTermViewContainer>
  );
};

export default AddEducationTermView;
