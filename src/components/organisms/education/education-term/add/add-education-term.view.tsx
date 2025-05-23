import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getDateTimeFromString } from '@/utils/date';
import { ko } from 'date-fns/locale';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import Quill from '@/components/atoms/common/input/quill';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import {
  EDUCATION_ENROLLMENT_STATUS,
  EDUCATION_TERM_STATUS,
  EducationEnrollment,
} from '@/models/education/education';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useEducationTermStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { BLANK } from '@/constants/constant';
import EducationEnrollmentList from '@/components/atoms/education/education-enrollment/education-enrollment-list';

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
  border: 1px solid ${GRAY.DEFAULT};
  border-radius: 5px;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
`;

const EnrollmentList = styled.div`
  display: flex;
`;

type AddEducationTermViewProps = {
  inCharge: DropdownValueType[];
  content: string;
  onChangeStatus: (value: EDUCATION_TERM_STATUS) => void;
  onChangeTerm: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
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
  onChangeEndDate,
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
        />
      </InputContainer>

      {/* 기간 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('period')}</MainText>
          <PeriodContainer>
            <CustomDatePicker
              value={targetEducationTerm.startDate}
              selected={getDateTimeFromString(targetEducationTerm.startDate)}
              onChange={onChangeStartDate}
              dateFormat="yyyy-MM-dd"
              placeholderText={t('startDate')}
              showYearDropdown={true}
              scrollableYearDropdown
              yearDropdownItemNumber={50}
              locale={ko}
              // showTimeSelect={true}
              showTimeInput={true}
              showTimeCaption={true}
              timeCaption={'시간'}
              timeIntervals={15}
              timeFormat="aa h:mm"
            />
            <MainText>{'-'}</MainText>
            <CustomDatePicker
              value={targetEducationTerm.endDate}
              selected={getDateTimeFromString(targetEducationTerm.endDate)}
              onChange={onChangeEndDate}
              dateFormat="yyyy-MM-dd"
              placeholderText={t('endDate')}
              showYearDropdown={true}
              scrollableYearDropdown
              yearDropdownItemNumber={50}
              locale={ko}
              // showTimeSelect={true}
              showTimeInput={true}
              showTimeCaption={true}
              timeCaption={'시간'}
              timeIntervals={15}
              timeFormat="aa h:mm"
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
            // isUserMember={true}
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
