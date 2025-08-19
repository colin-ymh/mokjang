import styled from 'styled-components';
import { ORANGE, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';

import Warning from '../../../../../public/svg/warning.svg';
import Stop from '../../../../../public/svg/stop.svg';
import { useI18n } from '../../../../../locales/client';

const WarningContainer = styled.div`
  display: flex;
  padding: 20px;
  gap: 10px;
  border-radius: 8px;
  background-color: ${ORANGE.EXTRA_LIGHT};
  border: 1px solid ${ORANGE.EXTRA_LIGHT};
  flex-direction: row;
`;

const IconContainer = styled.div`
  display: flex;
  width: 30px;
`;

const WarningIcon = styled(Warning)`
  width: 20px;
  height: 20px;
  stroke: ${ORANGE.DEFAULT};
  stroke-width: 2px;
`;

const StopIcon = styled(Stop)`
  width: 16px;
  height: 16px;
  stroke: ${ORANGE.DEFAULT};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

type StopWarningButtonProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const StopWarningButton = ({
  title,
  description,
  buttonText,
  onClick,
  disabled = false,
}: StopWarningButtonProps) => {
  const t = useI18n();
  return (
    <WarningContainer>
      <IconContainer>
        <WarningIcon />
      </IconContainer>
      <ContentContainer>
        <MainText color={ORANGE.EXTRA_DARK}>{title || t('warning')}</MainText>
        <MainText color={ORANGE.DEFAULT} whiteSpace={'normal'}>
          {description}
        </MainText>
        <ButtonContainer>
          <Button
            text={buttonText || t('button.stop')}
            width={'auto'}
            height={30}
            borderColor={ORANGE.EXTRA_LIGHT}
            color={ORANGE.EXTRA_DARK}
            backgroundColor={WHITE}
            icon={<StopIcon />}
            onClick={onClick}
            disabled={disabled}
          />
        </ButtonContainer>
      </ContentContainer>
    </WarningContainer>
  );
};

export default StopWarningButton;
