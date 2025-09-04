import styled from 'styled-components';
import { DESTRUCTIVE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { Button } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';

const WarningContainer = styled.div`
  display: flex;
  padding: 20px;
  gap: 10px;
  border-radius: 8px;
  background-color: ${DESTRUCTIVE.EXTRA_LIGHT};
  border: 1px solid ${DESTRUCTIVE.LIGHT};
  flex-direction: row;
  width: 100%;
`;

const IconContainer = styled.div`
  display: flex;
  width: 30px;
`;

const WarningIcon = styled(Svg.Warning)`
  width: 20px;
  height: 20px;
  stroke: ${DESTRUCTIVE.DEFAULT};
  stroke-width: 2px;
`;

const TrashIcon = styled(Svg.Trash)`
  width: 16px;
  height: 16px;
  stroke: ${DESTRUCTIVE.DARK};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

type DeleteWarningButtonProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const DeleteWarningButton = ({
  title,
  description,
  buttonText,
  onClick,
  disabled = false,
}: DeleteWarningButtonProps) => {
  const t = useI18n();
  return (
    <WarningContainer>
      <IconContainer>
        <WarningIcon />
      </IconContainer>
      <ContentContainer>
        <MainText color={DESTRUCTIVE.EXTRA_DARK}>
          {title || t('warning')}
        </MainText>
        <MainText color={DESTRUCTIVE.DARK} whiteSpace={'normal'}>
          {description}
        </MainText>
        <ButtonContainer>
          <Button
            text={buttonText || t('button.delete')}
            width={'auto'}
            height={30}
            borderColor={DESTRUCTIVE.LIGHT}
            color={DESTRUCTIVE.EXTRA_DARK}
            backgroundColor={WHITE}
            icon={<TrashIcon />}
            onClick={onClick}
            disabled={disabled}
          />
        </ButtonContainer>
      </ContentContainer>
    </WarningContainer>
  );
};

export default DeleteWarningButton;
