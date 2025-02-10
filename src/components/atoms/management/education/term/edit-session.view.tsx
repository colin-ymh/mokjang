import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import LabelInput from '@/components/atoms/common/input/label-input';
import LabelTextarea from '@/components/atoms/common/input/label-textarea';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';
import { SIZE } from '@/constants/styles/style';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';

const SessionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const TextContainer = styled.div`
  padding: 30px 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0 20px;
  gap: 20px;
  overflow-y: auto;
  margin-bottom: 60px;
  height: 100%;
  flex-grow: 1;
`;

const DoneContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 10px;
`;

type EditSessionViewProps = {
  sessionDate: string;
  isSessionDone: boolean;
  sessionContent: string;
  onChangeSessionDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSessionDone: (isDone: boolean) => void;
  onChangeSessionContent: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickSave: () => void;
};

const EditSessionView = ({
  sessionDate,
  isSessionDone,
  sessionContent,
  onChangeSessionDate,
  onChangeSessionDone,
  onChangeSessionContent,
  onClickSave,
}: EditSessionViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  return (
    <SessionContainer>
      <TextContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t('register.termHeaderPhrase')}
        </MainText>
      </TextContainer>
      <ContentContainer>
        <LabelInput
          label={t('educationDate')}
          value={sessionDate}
          onChange={onChangeSessionDate}
          placeholder={t_placeholder('sessionDate')}
        />
        <DoneContainer>
          <MainText>{t('isSessionDone')}</MainText>
          <CheckButton value={isSessionDone} onChange={onChangeSessionDone} />
        </DoneContainer>
        <LabelTextarea
          label={t('sessionContent')}
          value={sessionContent}
          onChange={onChangeSessionContent}
          height={200}
          placeholder={t_placeholder('sessionContent')}
        />
      </ContentContainer>
      <ButtonContainer>
        <Button text={t('button.save')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </SessionContainer>
  );
};

export default EditSessionView;
