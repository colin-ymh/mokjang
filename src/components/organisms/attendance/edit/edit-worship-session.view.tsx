import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import Quill from '@/components/atoms/common/input/quill';
import { BLANK } from '@/constants/constant';

const SessionInformationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
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

type EditWorshipSessionViewProps = {
  inCharge: MemberDropdownType[];
  description: string;
  onChangeSessionTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBibleTitle: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeVideoUrl: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeInCharge: (inCharge: MemberDropdownValueType[]) => void;
  onChangeDescription: (description: string) => void;
};

const EditWorshipSessionView = ({
  inCharge,
  description,
  onChangeSessionTitle,
  onChangeBibleTitle,
  onChangeVideoUrl,
  onChangeInCharge,
  onChangeDescription,
}: EditWorshipSessionViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  return (
    <SessionInformationContainer>
      <LabelInput
        label={t('worshipSessionTitle')}
        value={targetWorshipSession.title}
        onChange={onChangeSessionTitle}
        placeholder={t_placeholder('worshipSessionTitle')}
        height={40}
      />
      <RowContainer>
        <LabelInput
          label={t('worshipSessionBibleTitle')}
          value={targetWorshipSession.bibleTitle}
          onChange={onChangeBibleTitle}
          placeholder={t_placeholder('worshipSessionBibleTitle')}
          height={40}
        />
        <InputContainer>
          <LabelContainer>
            <MainText>{t('worshipSessionInCharge')}</MainText>
          </LabelContainer>
          <MultiMemberDropdown
            values={inCharge}
            onChangeValues={onChangeInCharge}
            isSingle={true}
            placeholder={
              inCharge.length === 0
                ? t_placeholder('worshipSessionInCharge')
                : BLANK
            }
            isManager={true}
            height={38}
          />
        </InputContainer>
      </RowContainer>
      <LabelInput
        label={t('worshipSessionVideoUrl')}
        value={targetWorshipSession.videoUrl}
        onChange={onChangeVideoUrl}
        placeholder={t_placeholder('worshipSessionVideoUrl')}
        height={40}
      />
      {/* 내용 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('worshipSessionDescription')}</MainText>
        </LabelContainer>
        <Quill
          value={description}
          onChange={(event) => onChangeDescription(event)}
          minHeight={150}
          placeholder={t_placeholder('worshipSessionDescription')}
        />
      </InputContainer>
    </SessionInformationContainer>
  );
};

export default EditWorshipSessionView;
