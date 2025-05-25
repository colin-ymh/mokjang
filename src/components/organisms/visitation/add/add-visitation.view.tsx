import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { BLANK } from '@/constants/constant';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import {
  VISITATION_METHOD,
  VisitationDetail,
} from '@/models/visitation/visitation';
import {
  useTimeDropdownItems,
  useVisitationMethodDropdownItems,
  useVisitationStatusDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import Quill from '@/components/atoms/common/input/quill';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@/utils/date';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { VISITATION_STATUS } from '@/constants/status/status';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddVisitationViewContainer = styled.div`
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
const DetailContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

const RequiredMark = styled.span`
  color: red;
  margin-right: 4px;
`;

type AddVisitationViewProps = {
  visitedMembers: DropdownValueType[];
  inCharge: DropdownValueType[];
  receivers: DropdownValueType[];
  localDetails: VisitationDetail[];
  onChangeStatus: (status: VISITATION_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (event: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (event: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeVisitedMembers: (members: MemberDropdownType[]) => void;
  onChangeMethod: (method: VISITATION_METHOD) => void;
  onChangeInCharge: (inCharge: MemberDropdownType[]) => void;
  onChangeReceivers: (receiver: MemberDropdownType[]) => void;
  onChangeContent: (memberId: string, content: string) => void;
  onChangePray: (memberId: string, content: string) => void;
};

const AddVisitationView = ({
  visitedMembers,
  inCharge,
  receivers,
  localDetails,
  onChangeStatus,
  onChangeTitle,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeVisitedMembers,
  onChangeMethod,
  onChangeInCharge,
  onChangeReceivers,
  onChangeContent,
  onChangePray,
}: AddVisitationViewProps) => {
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useVisitationStatusDropdownItems();
  const methodItems = useVisitationMethodDropdownItems();
  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddVisitationViewContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetVisitation.status}
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
          value={targetVisitation.title}
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
                targetVisitation.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetVisitation.startDate)
                    )
                  : undefined
              }
              selected={
                targetVisitation.startDate
                  ? getDateFromString(targetVisitation.startDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
              width={100}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetVisitation.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetVisitation.startDate)
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
                targetVisitation.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetVisitation.endDate)
                    )
                  : undefined
              }
              selected={
                targetVisitation.endDate
                  ? getDateFromString(targetVisitation.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              width={100}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetVisitation.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetVisitation.endDate)
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

      {/* 대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>
            <RequiredMark>*</RequiredMark>
            {t('visitedMember')}
          </MainText>
          <MultiMemberDropdown
            values={visitedMembers}
            onChangeValues={onChangeVisitedMembers}
            height={40}
            placeholder={
              visitedMembers.length === 0 ? t_placeholder('name') : BLANK
            }
          />
        </LabelContainer>
      </InputContainer>

      {/* 방식 */}
      <LabelDropdown
        label={t('method')}
        value={targetVisitation.visitationMethod}
        items={methodItems}
        onChangeItem={onChangeMethod}
        height={40}
      />

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
            isSingle
            placeholder={inCharge.length === 0 ? t_placeholder('name') : BLANK}
            isUserMember={true}
          />
        </LabelContainer>
      </InputContainer>

      {/* 세부 내용 */}
      {localDetails.map((detail) => (
        <DetailContainer key={detail.memberId}>
          {detail.member?.name && localDetails.length !== 1 && (
            <MainText fontWeight={600}>{detail.member.name}</MainText>
          )}
          {/* 내용 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationContent')}</MainText>
              <Quill
                value={detail.visitationContent}
                onChange={(html) => onChangeContent(detail.memberId, html)}
                minHeight={120}
                placeholder={t_placeholder('visitationContent')}
              />
            </LabelContainer>
          </InputContainer>
          {/* 기도제목 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationPray')}</MainText>
              <Quill
                value={detail.visitationPray}
                onChange={(html) => onChangePray(detail.memberId, html)}
                minHeight={120}
                placeholder={t_placeholder('visitationPray')}
              />
            </LabelContainer>
          </InputContainer>
        </DetailContainer>
      ))}

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
    </AddVisitationViewContainer>
  );
};

export default AddVisitationView;
