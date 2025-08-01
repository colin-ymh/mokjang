import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import React from 'react';
import { SIZE } from '@/constants/styles/style';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import Button from '@/components/atoms/common/button/button';
import EducationTermTable from '@/components/molecules/education/education-term/education-term-table';
import {
  getTranslatedDateFromDateString,
  getTranslatedMemberCount,
} from '@/utils/translate';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CardContainer = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
`;

const RowCardContainer = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type EducationInformationViewProps = {};

const EducationInformationView = ({}: EducationInformationViewProps) => {
  const t = useI18n();
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      {/* 교육 목표 */}
      <CardContainer $minHeight={100}>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>{t('educationGoal')}</MainText>
        </ContentContainer>
      </CardContainer>

      <RowContainer>
        {/* 기수 수 */}
        <RowCardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('educationTermCount')}
            </MainText>
            <MainText size={SIZE.EXTRA_LARGE}>
              {targetEducation.educationTerms.length}
            </MainText>
          </ContentContainer>
        </RowCardContainer>
        {/* 교인 수 */}
        <RowCardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('educationEnrollmentCount')}
            </MainText>
            <MainText size={SIZE.EXTRA_LARGE}>
              {getTranslatedMemberCount(locale, 25)}
            </MainText>
          </ContentContainer>
        </RowCardContainer>
        {/* 상세정보 */}
        <RowCardContainer $minHeight={100}>
          <ContentContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {t('educationInformation')}
            </MainText>
            <MainText>{targetEducation.creator.name}</MainText>
            <MainText>
              {getTranslatedDateFromDateString(
                locale,
                targetEducation.createdAt
              )}
            </MainText>
          </ContentContainer>
        </RowCardContainer>
      </RowContainer>
      {/* 교육 기수 */}
      <CardContainer $minHeight={200}>
        <ContentContainer>
          <RowContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('educationTerm')}</MainText>
            <Button
              text={t('button.addEducationTerm')}
              height={30}
              width={'auto'}
            />
          </RowContainer>
          <TableContainer>
            <EducationTermTable />
          </TableContainer>
        </ContentContainer>
      </CardContainer>
    </InformationContainer>
  );
};

export default EducationInformationView;
