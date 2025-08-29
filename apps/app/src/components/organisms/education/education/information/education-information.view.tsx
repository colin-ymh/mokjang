import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '../../../../atoms/common/text/main-text';
import { GRAY, GREEN, WHITE } from '../../../../../constants/styles/color';
import React from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../../constants/state/locale';
import Button from '../../../../atoms/common/button/button';
import EducationTermTable from '../../../../molecules/education/education-term/education-term-table';
import {
  getTranslatedDateFromDateString,
  getTranslatedTermCount,
} from '../../../../../utils/translate';
import Check from '../../../../../../public/svg/check.svg';
import SvgIcon from '../../../../atoms/common/icon/svg-icon';
import { SIZE } from '../../../../../constants/styles/style';

import { getTranslatedMemberCount } from '@mokjang/utils';

const InformationContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 30px;
  gap: 5px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const RowLine = styled.div`
  display: flex;
  width: 100%;
  height: 0.6px;
  background-color: ${GRAY.LIGHT};
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  padding: 20px;
  flex: 1;
  min-height: 80px;
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const GoalItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: ${GRAY.SUPER_LIGHT};
  border-radius: 5px;
  padding: 10px;
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type EducationInformationViewProps = {
  onClickAddEducationTermOpen: () => void;
};

const EducationInformationView = ({
  onClickAddEducationTermOpen,
}: EducationInformationViewProps) => {
  const t = useI18n();
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer>
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {`${targetEducation.name}`}
        </MainText>
        <MainText color={GRAY.DEFAULT}>
          {`${targetEducation.description}`}
        </MainText>
      </HeaderContainer>
      {/* 제목 */}
      <ContentContainer>
        {/* 교육 목표 */}
        <CardContainer>
          <MainText color={GRAY.SEMI_DARK}>{t('educationGoal')}</MainText>
          <GoalList>
            {targetEducation.goals.map((goal, index) => {
              if (goal.length !== 0)
                return (
                  <GoalItem key={index}>
                    <SvgIcon svg={Check} color={GREEN.DEFAULT} width={2} />
                    <MainText color={GRAY.SEMI_DARK}>{goal}</MainText>
                  </GoalItem>
                );
            })}
          </GoalList>
        </CardContainer>
        <RowContainer>
          {/* 기수 수 */}
          <CardContainer>
            <TitleContainer>
              <MainText color={GRAY.SEMI_DARK}>
                {t('educationTermCount')}
              </MainText>
            </TitleContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {getTranslatedTermCount(locale, targetEducation.termsCount)}
            </MainText>
          </CardContainer>
          {/* 교인 수 */}
          <CardContainer>
            <TitleContainer>
              <MainText color={GRAY.SEMI_DARK}>
                {t('educationEnrollmentCount')}
              </MainText>
            </TitleContainer>
            <MainText size={SIZE.EXTRA_LARGE}>
              {getTranslatedMemberCount(
                locale,
                targetEducation.completionMembersCount
              )}
            </MainText>
          </CardContainer>
          {/* 상세정보 */}
          <CardContainer>
            <TitleContainer>
              <MainText color={GRAY.SEMI_DARK}>
                {t('createdInformation')}
              </MainText>
            </TitleContainer>
            <ColumnContainer>
              <MainText>{`${t('creator')}: ${targetEducation.creator.name}`}</MainText>
              <MainText>
                {`${t('createdDate')}: ${getTranslatedDateFromDateString(
                  locale,
                  targetEducation.createdAt
                )}`}
              </MainText>
            </ColumnContainer>
          </CardContainer>
        </RowContainer>
        <RowLine />
        {/* 교육 기수 */}
        <TableHeader>
          <MainText color={GRAY.SEMI_DARK}>{t('educationTerm')}</MainText>
          <Button
            text={t('button.addEducationTerm')}
            height={30}
            width={'auto'}
            onClick={onClickAddEducationTermOpen}
          />
        </TableHeader>
        <TableContainer>
          <EducationTermTable />
        </TableContainer>
      </ContentContainer>
    </InformationContainer>
  );
};

export default EducationInformationView;
