import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { DOMAIN } from '@/models/permission/permission';
import { TAG_BACKGROUND_COLOR, TAG_FONT_COLOR } from '@/constants/styles/color';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  border-radius: 5px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 3px 5px;
`;

type DomainTagProps = {
  domain: DOMAIN;
};

const DomainTag = ({ domain }: DomainTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={TAG_BACKGROUND_COLOR}>
      <MainText color={TAG_FONT_COLOR}>{t(domain)}</MainText>
    </TagContainer>
  );
};

export default DomainTag;
