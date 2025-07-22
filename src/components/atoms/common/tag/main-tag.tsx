import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: inline-flex;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 100px;
  padding: 2px 8px;
`;

type MainTagProps = {
  title: string;
  backgroundColor?: string;
  color?: string;
};

const MainTag = ({
  title,
  backgroundColor = GRAY.EXTRA_LIGHT,
  color = GRAY.DEFAULT,
}: MainTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={backgroundColor}>
      <MainText color={color}>{title}</MainText>
    </TagContainer>
  );
};

export default MainTag;
