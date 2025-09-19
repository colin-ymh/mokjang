import styled from 'styled-components';
import { ORANGE, WHITE } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { Button } from '@mokjang/components';

import { useI18n } from '../../../../../locales/client';
import { SvgIcon } from '../../../../../../../packages/components/src';
import { Svg } from '@mokjang/assets';
import React from 'react';

const WarningContainer = styled.div`
  display: flex;
  padding: 20px;
  gap: 10px;
  border-radius: 8px;
  background-color: ${ORANGE.EXTRA_LIGHT};
  border: 1px solid ${ORANGE.EXTRA_LIGHT};
  flex-direction: row;
  width: 100%;
`;

const IconContainer = styled.div`
  display: flex;
  width: 30px;
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
  buttonIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const StopWarningButton = ({
  title,
  description,
  buttonText,
  onClick,
  disabled = false,
  buttonIcon,
}: StopWarningButtonProps) => {
  const t = useI18n();
  return (
    <WarningContainer>
      <IconContainer>
        <SvgIcon svg={Svg.Warning} size={20} width={2} color={ORANGE.DEFAULT} />
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
            icon={
              <SvgIcon
                svg={buttonIcon || Svg.Stop}
                size={16}
                color={ORANGE.DEFAULT}
              />
            }
            onClick={onClick}
            disabled={disabled}
          />
        </ButtonContainer>
      </ContentContainer>
    </WarningContainer>
  );
};

export default StopWarningButton;
