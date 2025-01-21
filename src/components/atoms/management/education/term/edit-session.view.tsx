import styled from 'styled-components';
import { ChangeEvent } from 'react';
import LabelInput from '@/components/atoms/common/input/label-input';
import { useI18n } from '../../../../../../locales/client';
import LabelTextarea from '@/components/atoms/common/input/label-textarea';
import Button from '@/components/atoms/common/button/button';

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

const ButtonContainer = styled.div`
  display: flex;
`;

type EditSessionViewProps = {
  sessionDate: string;
  sessionContent: string;
  onChangeSessionDate: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeSessionContent: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClickSave: () => void;
};

const EditSessionView = ({
  sessionDate,
  sessionContent,
  onChangeSessionDate,
  onChangeSessionContent,
  onClickSave,
}: EditSessionViewProps) => {
  const t = useI18n();
  return (
    <SessionContainer>
      <ContentContainer>
        <LabelInput
          label={t('educationDate')}
          value={sessionDate}
          onChange={onChangeSessionDate}
        />
        <LabelTextarea
          label={t('sessionContent')}
          value={sessionContent}
          onChange={onChangeSessionContent}
          height={200}
        />
      </ContentContainer>
      <ButtonContainer>
        <Button text={t('button.save')} height={40} onClick={onClickSave} />
      </ButtonContainer>
    </SessionContainer>
  );
};

export default EditSessionView;
