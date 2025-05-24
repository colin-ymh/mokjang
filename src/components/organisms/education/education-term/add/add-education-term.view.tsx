import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Quill from '@/components/atoms/common/input/quill';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import {
  useEducationTermStatusDropdownItems,
  useTimeDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import { BLANK } from '@/constants/constant';
import EducationEnrollmentList from '@/components/atoms/education/education-enrollment/education-enrollment-list';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromString,
  getDateStringFromDate,
  getTotalMinuteFromDate,
} from '@/utils/date';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';

import { EDUCATION_TERM_STATUS } from '@/constants/status/status';

const AddEducationTermViewContainer = styled.div`
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

type AddEducationTermViewProps = {
  inCharge: DropdownValueType[];
  content: string;
  onChangeStatus: (value: EDUCATION_TERM_STATUS) => void;
  onChangeTerm: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeStartTime: (value: number) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeEndTime: (value: number) => void;
  onChangeInCharge: (values: DropdownValueType[]) => void;
  onChangeContent: (content: string) => void;
  onClickNewEnrollment: (values: MemberDropdownValueType[]) => void;
  onChangeEnrollmentStatus: (
    value: EDUCATION_ENROLLMENT_STATUS,
    enrollment: EducationEnrollment
  ) => void;
};

const AddEducationTermView = ({
  inCharge,
  content,
  onChangeStatus,
  onChangeTerm,
  onChangeStartDate,
  onChangeStartTime,
  onChangeEndDate,
  onChangeEndTime,
  onChangeInCharge,
  onChangeContent,
  onClickNewEnrollment,
  onChangeEnrollmentStatus,
}: AddEducationTermViewProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useEducationTermStatusDropdownItems();
  const timeDropdownItems = useTimeDropdownItems();

  return (
    <AddEducationTermViewContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetEducationTerm.status}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={40}
        />
      </InputContainer>

      {/* 기수 */}
      <InputContainer>
        <LabelInput
          label={t('term')}
          value={targetEducationTerm.term}
          onChange={onChangeTerm}
          placeholder={t_placeholder('term')}
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
                targetEducationTerm.startDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetEducationTerm.startDate)
                    )
                  : undefined
              }
              selected={
                targetEducationTerm.startDate
                  ? getDateFromString(targetEducationTerm.startDate)
                  : null
              }
              onChange={onChangeStartDate}
              placeholderText={t('startDate')}
              width={100}
            />
            {/* 시작 시간 */}
            <Dropdown
              value={
                targetEducationTerm.startDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetEducationTerm.startDate)
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
                targetEducationTerm.endDate
                  ? getDateStringFromDate(
                      getDateFromDateString(targetEducationTerm.endDate)
                    )
                  : undefined
              }
              selected={
                targetEducationTerm.endDate
                  ? getDateFromString(targetEducationTerm.endDate)
                  : null
              }
              onChange={onChangeEndDate}
              placeholderText={t('endDate')}
              width={100}
            />
            {/* 종료 시간 */}
            <Dropdown
              value={
                targetEducationTerm.endDate
                  ? getTotalMinuteFromDate(
                      getDateFromString(targetEducationTerm.endDate)
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

      {/* 내용 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('content')}</MainText>
          <Quill
            value={content}
            onChange={(event) => onChangeContent(event)}
            minHeight={120}
            placeholder={t_placeholder('content')}
          />
        </LabelContainer>
      </InputContainer>

      {/* 담당자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('inCharge')}</MainText>
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

      {/* 수강 교인 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('educationEnrollment')}</MainText>
          <MultiMemberDropdown
            values={[]}
            onChangeValues={onClickNewEnrollment}
            placeholder={t_placeholder('name')}
          />
          <EducationEnrollmentList
            enrollments={targetEducationTerm.educationEnrollments}
            onChangeStatus={onChangeEnrollmentStatus}
          />
        </LabelContainer>
      </InputContainer>
    </AddEducationTermViewContainer>
  );
};

export default AddEducationTermView;
