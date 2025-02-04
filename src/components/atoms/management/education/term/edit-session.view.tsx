import styled from 'styled-components';
import { ChangeEvent } from 'react';
import LabelInput from '@/components/atoms/common/input/label-input';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import LabelTextarea from '@/components/atoms/common/input/label-textarea';
import Button from '@/components/atoms/common/button/button';
import { MainText } from '@/components/atoms/common/text/main-text';
import CheckButton from '@/components/atoms/common/button/check-button';

const SessionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const DoneContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
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
