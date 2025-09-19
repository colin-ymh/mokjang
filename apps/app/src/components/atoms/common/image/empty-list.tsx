import styled from 'styled-components';
import { MainText, SvgIcon } from '@mokjang/components';
import { Svg } from '@mokjang/assets';
import { GRAY } from '@mokjang/constants';
import { useScopedI18n } from '../../../../../locales/client';

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

type EmptyListProps = {
  size?: number;
  text?: string;
};

const EmptyList = ({ size = 50, text }: EmptyListProps) => {
  const t_description = useScopedI18n('description');
  return (
    <ImageContainer>
      <SvgIcon svg={Svg.Empty} width={1} size={size} color={GRAY.DARK} />
      <MainText color={GRAY.DARK}>
        {text ?? t_description('emptyList')}
      </MainText>
    </ImageContainer>
  );
};

export default EmptyList;
