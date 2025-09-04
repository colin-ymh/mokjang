import styled from 'styled-components';
import { useI18n } from '../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { MainText } from '@mokjang/components';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: 20px;
`;

const InformationItemContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  height: 80px;
  padding: 16px;
  border-radius: 12px;
  gap: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const MEMBER_COUNT_BACKGROUND = '#EFF6FF';
const GROUP_COUNT_BACKGROUND = '#F0FDF4';
const MINISTRY_GROUP_COUNT_BACKGROUND = '#FAF5FF';

const MEMBER_COUNT_COLOR = '#2563EB';
const GROUP_COUNT_COLOR = '#16A34A';
const MINISTRY_GROUP_COUNT_COLOR = '#9333EA';

type ChurchStateProps = {};

const ChurchState = ({}: ChurchStateProps) => {
  const { church } = useSelector((state: RootState) => state.church);
  const t = useI18n();
  return (
    <InformationContainer>
      <InformationItemContainer $backgroundColor={MEMBER_COUNT_BACKGROUND}>
        <MainText color={MEMBER_COUNT_COLOR} fontSize={25} fontWeight={700}>
          {church.memberCount}
        </MainText>
        <MainText color={MEMBER_COUNT_COLOR}>{t('memberCount')}</MainText>
      </InformationItemContainer>
      <InformationItemContainer $backgroundColor={GROUP_COUNT_BACKGROUND}>
        <MainText color={GROUP_COUNT_COLOR} fontSize={25} fontWeight={700}>
          {church.groupCount}
        </MainText>
        <MainText color={GROUP_COUNT_COLOR}>{t('groupCount')}</MainText>
      </InformationItemContainer>
      <InformationItemContainer
        $backgroundColor={MINISTRY_GROUP_COUNT_BACKGROUND}
      >
        <MainText
          color={MINISTRY_GROUP_COUNT_COLOR}
          fontSize={25}
          fontWeight={700}
        >
          {church.ministryGroupCount}
        </MainText>
        <MainText color={MINISTRY_GROUP_COUNT_COLOR}>
          {t('ministryGroupCount')}
        </MainText>
      </InformationItemContainer>
    </InformationContainer>
  );
};

export default ChurchState;
