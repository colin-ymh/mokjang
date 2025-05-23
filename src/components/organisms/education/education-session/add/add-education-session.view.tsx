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
import { EDUCATION_SESSION_STATUS } from '@/models/education/education';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useEducationSessionStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { BLANK } from '@/constants/constant';

const AddEducationSessionViewContainer = styled.div`
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

type AddEducationSessionViewProps = {
  inCharge: DropdownValueType[];
  content: string;
  receivers: MemberDropdownValueType[];
  onChangeStatus: (value: EDUCATION_SESSION_STATUS) => void;
  onChangeTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSession: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeInCharge: (values: DropdownValueType[]) => void;
  onChangeContent: (content: string) => void;
  // onClickNewEnrollment: (values: MemberDropdownValueType[]) => void;
  // onChangeEnrollmentStatus: (
  //   value: EDUCATION_STATUS,
  //   enrollment: EducationEnrollment
  // ) => void;
  onChangeReceivers: (values: MemberDropdownValueType[]) => void;
};

const AddEducationSessionView = ({
  content,
  inCharge,
  receivers,
  onChangeStatus,
  onChangeTitle,
  onChangeSession,
  onChangeStartDate,
  onChangeEndDate,
  onChangeInCharge,
  onChangeContent,
  onChangeReceivers,
}: AddEducationSessionViewProps) => {
  const { targetEducationSession } = useSelector(
    (state: RootState) => state.targetEducationSession
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const statusDropdownItems = useEducationSessionStatusDropdownItems();

  return (
    <AddEducationSessionViewContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetEducationSession.status}
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
          value={targetEducationSession.title}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.DEFAULT}
          height={40}
        />
      </InputContainer>
      {/* 회차 */}
      <InputContainer>
        <LabelInput
          label={t('session')}
          value={targetEducationSession.session}
          onChange={onChangeSession}
          placeholder={t_placeholder('session')}
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
              value={targetEducationSession.startDate}
              selected={getDateTimeFromString(targetEducationSession.startDate)}
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
              value={targetEducationSession.endDate}
              selected={getDateTimeFromString(targetEducationSession.endDate)}
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
      {/* 보고대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('receiver')}</MainText>
          <MultiMemberDropdown
            values={receivers}
            onChangeValues={onChangeReceivers}
            height={40}
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
          />
        </LabelContainer>
      </InputContainer>

      {/* 수강 교인 */}
      {/*<InputContainer>*/}
      {/*  <LabelContainer>*/}
      {/*    <MainText>{'수강 교인'}</MainText>*/}
      {/*    <MultiMemberDropdown*/}
      {/*      values={[]}*/}
      {/*      onChangeValues={onClickNewEnrollment}*/}
      {/*      placeholder={t_placeholder('name')}*/}
      {/*    />*/}
      {/*    <EducationEnrollmentList*/}
      {/*      enrollments={targetEducationSession.educationEnrollments}*/}
      {/*      onChangeStatus={onChangeEnrollmentStatus}*/}
      {/*    />*/}
      {/*  </LabelContainer>*/}
      {/*</InputContainer>*/}
    </AddEducationSessionViewContainer>
  );
};

export default AddEducationSessionView;
