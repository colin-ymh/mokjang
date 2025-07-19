import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { TAG_BACKGROUND_COLOR, TAG_FONT_COLOR } from '@/constants/styles/color';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: inline-flex;
  border-radius: 100px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 2px 8px;
`;

type MainTagProps = {
  title: string;
  backgroundColor?: string;
  color?: string;
};

const MainTag = ({
  title,
  backgroundColor = TAG_BACKGROUND_COLOR,
  color = TAG_FONT_COLOR,
}: MainTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={backgroundColor}>
      <MainText color={color}>{title}</MainText>
    </TagContainer>
  );
};

export default MainTag;
