import styled from 'styled-components';
import { LabelInput, MainText } from '@mokjang/components';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import React, { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import MemberDropdown from '../../../atoms/common/dropdown/member-dropdown';
import Quill from '../../../atoms/common/input/quill';
import { BLANK } from '@mokjang/constants';
import { MemberDropdownValueType } from '@mokjang/models';

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
  onChangeDescription: (content: string, delta: any, source: string) => void;
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
          <MemberDropdown
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
          onChange={(content, delta, source) =>
            onChangeDescription(content, delta, source)
          }
          minHeight={150}
          placeholder={t_placeholder('worshipSessionDescription')}
        />
      </InputContainer>
    </SessionInformationContainer>
  );
};

export default EditWorshipSessionView;
