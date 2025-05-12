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
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { BLANK } from '@/constants/constant';

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

type AddEducationTermViewProps = {
  receivers: MemberDropdownValueType[];
  comment: string;
  onChangeTerm: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onChangeComment: (comment: string) => void;
  onChangeReceivers: (values: MemberDropdownValueType[]) => void;
};

const AddEducationTermView = ({
  receivers,
  comment,
  onChangeTerm,
  onChangeStartDate,
  onChangeEndDate,
  onChangeComment,
  onChangeReceivers,
}: AddEducationTermViewProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <AddEducationTermViewContainer>
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
          <MainText>{t('comment')}</MainText>
          <Quill
            value={comment}
            onChange={(event) => onChangeComment(event)}
            minHeight={120}
            placeholder={t_placeholder('comment')}
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
    </AddEducationTermViewContainer>
  );
};

export default AddEducationTermView;
