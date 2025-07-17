import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n } from '../../../../../locales/client';
import {
  STATUS_BACKGROUND_COLOR,
  STATUS_FONT_COLOR,
} from '@/constants/styles/color';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  border-radius: 5px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 3px 5px;
`;

type GroupLeaderTagProps = {};

const GroupLeaderTag = ({}: GroupLeaderTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={STATUS_BACKGROUND_COLOR.PENDING}>
      <MainText color={STATUS_FONT_COLOR.PENDING}>{t('groupLeader')}</MainText>
    </TagContainer>
  );
};

export default GroupLeaderTag;
