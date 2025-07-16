import { STATUS } from '@/constants/status/status';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';
import { useI18n } from '../../../../../locales/client';

const TagContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  border-radius: 10px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 3px 5px;
`;

type StatusTagProps = {
  status: STATUS;
};

const StatusTag = ({ status }: StatusTagProps) => {
  const t = useI18n();
  return (
    <TagContainer $backgroundColor={getStatusBackgroundColor(status)}>
      <MainText color={getStatusFontColor(status)}>{t(status)}</MainText>
    </TagContainer>
  );
};

export default StatusTag;
