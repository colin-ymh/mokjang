import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import { TAG_BACKGROUND_COLOR, TAG_FONT_COLOR } from '@/constants/styles/color';
import { Group } from '@/models/management/management';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  border-radius: 5px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 3px 5px;
  flex-shrink: 0;
`;

type GroupTagProps = {
  group: Group;
};

const GroupTag = ({ group }: GroupTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={TAG_BACKGROUND_COLOR}>
      <MainText color={TAG_FONT_COLOR}>{group.name || t('noGroup')}</MainText>
    </TagContainer>
  );
};

export default GroupTag;
