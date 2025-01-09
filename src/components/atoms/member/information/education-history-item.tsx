import styled from 'styled-components';

import { EducationHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import { getFormattedDate, getKRDateFromDashDate } from '@/utils/format';

import { useI18n } from '../../../../../locales/client';

const BackgroundContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 50px;
  border-radius: 5px;
  position: relative;
  //cursor: pointer;
  transition: background-color 0.3s;
  // &:hover {
  //   background-color: ${GRAY.LIGHT};
  // }
`;

const NameContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const PeriodContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 2;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type EducationHistoryItemProps = {
  education: EducationHistory;
  onClickEditEducation: (education: EducationHistory) => void;
  onClickDeleteEducation: (educationId: string) => void;
};

const EducationHistoryItem = ({
  education,
  onClickEditEducation,
  onClickDeleteEducation,
}: EducationHistoryItemProps) => {
  const t = useI18n();

  return (
    <BackgroundContainer>
      <ItemContainer>
        {/* 그룹명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('educationName')}</MainText>
          <MainText>{education.educationName}</MainText>
        </NameContainer>
        {/* 역할 */}
        <RoleContainer>
          <MainText color={GRAY.DARK}>{t('educationStatus')}</MainText>
          <MainText>{t(education.status)}</MainText>
        </RoleContainer>
        {/* 기간 */}
        <PeriodContainer>
          <MainText color={GRAY.DARK}>{t('period')}</MainText>
          <DateContainer>
            <MainText>
              {getKRDateFromDashDate(getFormattedDate(education.startDate))}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {education?.endDate &&
                getKRDateFromDashDate(getFormattedDate(education?.endDate))}
            </MainText>
          </DateContainer>
        </PeriodContainer>
        {/* 버튼들 */}
        <SlideButtonList
          isAddShown={false}
          buttonSize={25}
          onClickEdit={() => onClickEditEducation(education)}
          onClickDelete={() => onClickDeleteEducation(education.id)}
        />
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default EducationHistoryItem;
