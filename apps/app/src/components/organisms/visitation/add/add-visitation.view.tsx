import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, LOCALE } from '@mokjang/constants';
import { useTimeDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { BorderInput, MainText, RequiredMark } from '@mokjang/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
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
const AddVisitationViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
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
  gap: 15px;
  width: 100%;
`;

const MemberTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: row;
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
  display: flex;
  gap: 10px;
  width: 100%;
`;

type AddVisitationViewProps = {
  isEdit: boolean;
  visitedMembers: MemberDropdownType[];
  inCharge: MemberDropdownType[];
  receivers: MemberDropdownType[];
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (event: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (event: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeVisitedMembers: (members: MemberDropdownType[]) => void;
  onChangeInCharge: (inCharge: MemberDropdownType[]) => void;
  onChangeReceivers: (receiver: MemberDropdownType[]) => void;
  onChangeContent: (content: string, delta: any, source: string) => void;
  onChangePray: (content: string, delta: any, source: string) => void;
  onClickDeleteVisitedMember: (memberId: string) => void;
  onClickDeleteReceiver: (memberId: string) => void;
};

const AddVisitationView = ({
  isEdit,
  visitedMembers,
  inCharge,
  receivers,
  onChangeTitle,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeVisitedMembers,
  onChangeInCharge,
  onChangeReceivers,
  onChangeContent,
  onChangePray,
  onClickDeleteVisitedMember,
  onClickDeleteReceiver,
}: AddVisitationViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const timeDropdownItems = useTimeDropdownItems(locale);

  return (
    <AddVisitationViewContainer>
      {/*<HeaderContainer>*/}
      {/*  <MainText  fontSize={22}>*/}
      {/*    {t(isEdit ? 'title.editVisitation' : 'title.addVisitation')}*/}
      {/*  </MainText>*/}
      {/*</HeaderContainer>*/}

      {/* 제목 */}

      <ContentContainer>
        <MainText fontWeight={600}>
          {t('title')}
          <RequiredMark />
        </MainText>
        <BorderInput
          value={targetVisitation.title}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.LIGHT}
        />
      </ContentContainer>

      {/* 일정 */}
      <ContentContainer>
        <MainText fontWeight={600}>
          {t('period')}
          <RequiredMark />
        </MainText>
        {/* 기간 */}
        <RowContainer>
          {/* 시작 날짜 */}
          <CustomDatePicker
            value={
              targetVisitation.startDate
                ? getDateStringFromDate(
                    getDateFromDateString(targetVisitation.startDate)
                  )
                : undefined
            }
            selected={
              targetVisitation.startDate
                ? getDateFromDateString(targetVisitation.startDate)
                : null
            }
            onChange={onChangeStartDate}
            placeholderText={t('date')}
          />
          <RowContainer>
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetVisitation.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromDateString(targetVisitation.startDate)
                    )
                  : 8 * 60
              }
              items={timeDropdownItems}
              onChangeItem={onChangeStartTime}
              chevronColor={GRAY.DEFAULT}
            />
            {/*/!* 종료 날짜 *!/*/}
            {/*<CustomDatePicker*/}
            {/*  value={*/}
            {/*    targetVisitation.endDate*/}
            {/*      ? getDateStringFromDate(*/}
            {/*          getDateFromDateString(targetVisitation.endDate)*/}
            {/*        )*/}
            {/*      : undefined*/}
            {/*  }*/}
            {/*  selected={*/}
            {/*    targetVisitation.endDate*/}
            {/*      ? getDateFromDateString(targetVisitation.endDate)*/}
            {/*      : null*/}
            {/*  }*/}
            {/*  onChange={onChangeEndDate}*/}
            {/*  placeholderText={t('endDate')}*/}
            {/*/>*/}
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetVisitation.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromDateString(targetVisitation.endDate)
                    )
                  : 8 * 60
              }
              items={timeDropdownItems}
              onChangeItem={onChangeEndTime}
              chevronColor={GRAY.DEFAULT}
            />
          </RowContainer>
        </RowContainer>
      </ContentContainer>

      {/* 대상자 / 담당자 */}
      <RowContainer>
        {/* 대상자 */}
        <ContentContainer>
          <MainText fontWeight={600}>
            {t('visitedMember')}
            <RequiredMark />
          </MainText>
          <MemberDropdown
            values={visitedMembers}
            onChangeValues={onChangeVisitedMembers}
            placeholder={t_placeholder('name')}
          />
          {/* 대상자 목록 */}
          <MemberTagList>
            {visitedMembers.map((member) => (
              <MemberTag
                key={member.value}
                profileImage={member.profileImage}
                name={member.title}
                officer={member.officer}
                onClick={() => onClickDeleteVisitedMember(member.value)}
              />
            ))}
          </MemberTagList>
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
      </RowContainer>

      {/* 세부 내용 */}

      <ContentContainer>
        <MainText fontWeight={600}>{t('visitationContent')}</MainText>
        <Quill
          value={targetVisitation.visitationDetails[0].visitationContent}
          onChange={(content, delta, source) =>
            onChangeContent(content, delta, source)
          }
          minHeight={150}
          placeholder={t_placeholder('visitationContent')}
        />
      </ContentContainer>

      {/* 기도제목 */}

      <ContentContainer>
        <MainText fontWeight={600}>{t('visitationPray')}</MainText>
        <Quill
          value={targetVisitation.visitationDetails[0].visitationPray}
          onChange={(content, delta, source) =>
            onChangePray(content, delta, source)
          }
          minHeight={150}
          placeholder={t_placeholder('visitationPray')}
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
    </AddVisitationViewContainer>
  );
};

export default AddVisitationView;
