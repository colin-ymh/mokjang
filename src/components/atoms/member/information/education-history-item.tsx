import styled from 'styled-components';

import { EducationHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';

import { useI18n } from '../../../../../locales/client';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';

const BackgroundContainer = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-bottom: ${({ $isCurrent }) => ($isCurrent ? '0px' : '1px')} solid
    ${GRAY.SEMI_LIGHT};
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
  //   background-color: ${GRAY.SEMI_LIGHT};
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
  isCurrent?: boolean;
  // onClickEditEducation: (education: EducationHistory) => void;
  // onClickDeleteEducation: (educationId: string) => void;
};

const EducationHistoryItem = ({
  education,
  isCurrent,
  // onClickEditEducation,
  // onClickDeleteEducation,
}: EducationHistoryItemProps) => {
  const t = useI18n();
  // 로케일 코드
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;
  return (
    <BackgroundContainer $isCurrent={isCurrent}>
      <ItemContainer>
        {/* 그룹명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('educationName')}</MainText>
          <MainText>{education.educationTerm.educationName}</MainText>
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
              {getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(education.educationTerm.startDate)
              )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {education.educationTerm?.endDate
                ? getLocaleDateFromDashDate(
                    basePath,
                    getFormattedDate(education.educationTerm?.endDate)
                  )
                : t('inProgress')}
            </MainText>
          </DateContainer>
        </PeriodContainer>
        {/* 버튼들 */}
        {/*<SlideButtonList*/}
        {/*  isAddShown={false}*/}
        {/*  buttonSize={25}*/}
        {/*  onClickEdit={() => onClickEditEducation(education)}*/}
        {/*  onClickDelete={() => onClickDeleteEducation(education.id)}*/}
        {/*/>*/}
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default EducationHistoryItem;
